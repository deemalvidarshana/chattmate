"""
Copyright 2024-2026 ChatterMate

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import traceback
from fastapi import APIRouter, Depends, HTTPException, status
from app.core import config
from app.core.logger import get_logger
from app.database import get_db
from app.services.feature_gate import check_feature_access
from app.models.user import User
from app.core.auth import get_current_user, require_permissions
from app.repositories.ai_config import AIConfigRepository
from app.agents.chat_agent import ChatAgent
from app.models.schemas.ai_config import (
    AIConfigCreate, AIConfigResponse, AISetupResponse, AIConfigUpdate,
    VoiceConfigResponse, VoiceConfigUpdate,
)
from sqlalchemy.orm import Session
import os

from app.models.ai_config import AIModelType
from app.core.model_catalog import is_known_provider, list_providers
from app.services import platform_ai
from app.core.security import encrypt_api_key

# Try to import enterprise modules
try:
    from app.enterprise.repositories.plan import PlanRepository
    from app.enterprise.services.feature_access import require_accessible_subscription
    HAS_ENTERPRISE = True
except ImportError:
    HAS_ENTERPRISE = False

router = APIRouter()
logger = get_logger(__name__)


CUSTOM_MODELS_UPGRADE_MESSAGE = (
    "Custom Models feature is not available in your current plan. "
    "Please upgrade to access this feature."
)


def check_custom_models_feature_access(current_user: User, db: Session):
    """Check if user has access to custom models feature"""
    if not HAS_ENTERPRISE:
        # Defers to this repository's plan catalog — see workflow.py for why.
        check_feature_access(db, current_user.organization_id, 'custom_models',
                             CUSTOM_MODELS_UPGRADE_MESSAGE)
        return

    # Accessible = active/trial/past-due-in-period OR cancelled-but-still-in-
    # paid-period; raises 403 when the org has no accessible plan.
    subscription = require_accessible_subscription(db, current_user.organization_id)
    plan_repo = PlanRepository(db)

    # Check if custom models feature is available in the plan
    if not plan_repo.check_feature_availability(str(subscription.plan_id), 'custom_models'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Custom Models feature is not available in your current plan. Please upgrade to access this feature."
        )


# Providers and their suggested models live in app.core.model_catalog (single
# source of truth, also served by GET /ai/providers). Model IDs are not hard-coded
# here anymore: orgs may enter a custom model ID, so validation only checks that the
# provider is known — the live API-key test rejects a bad model ID.


def _setup_platform_model(db: Session, current_user: User) -> AISetupResponse:
    """Point this organization at the platform's managed model.

    The provider's real identity is stored in model_type so the right client gets
    built, with is_platform_managed recording whose account pays. Copying the key
    onto the tenant row keeps every existing consumer working unchanged; the
    console re-points these rows whenever the operator rotates the key.
    """
    credentials = platform_ai.text_credentials(db)
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The managed model is not available yet — the platform operator "
                "has not finished configuring it. Use your own provider key for now."
            ),
        )

    provider, model_name, api_key = credentials
    ai_config = AIConfigRepository(db).create_config(
        org_id=current_user.organization_id,
        model_type=provider,
        model_name=model_name,
        api_key=api_key,
        is_platform_managed=True,
    )
    logger.info(
        "Org %s switched to the platform model (%s/%s)",
        current_user.organization_id, provider, model_name,
    )
    return AISetupResponse(
        message="AI configuration completed successfully",
        config=AIConfigResponse(
            id=ai_config.id,
            organization_id=ai_config.organization_id,
            model_type=ai_config.model_type,
            model_name=ai_config.model_name,
            is_active=ai_config.is_active,
            settings=ai_config.settings
        )
    )


@router.get("/providers")
async def get_providers(
    current_user: User = Depends(require_permissions("manage_ai_config")),
    db: Session = Depends(get_db),
):
    """Return the catalog of selectable providers and their suggested models.

    The managed option is listed first and only when the operator has actually
    configured it — offering a model that cannot answer would fail on the
    tenant's first real conversation rather than here.
    """
    providers = list_providers()

    if not HAS_ENTERPRISE and platform_ai.get_config(db).is_configured:
        providers = [{
            "value": "CHATTERMATE",
            "label": "Growmiq mini (managed)",
            "requires_api_key": False,
            "custom_allowed": False,
            "api_key_url": "",
            "models": [{"value": "chattermate", "label": "Managed model"}],
        }] + providers

    return {"providers": providers}


# Override model validation in the schemas
@router.post("/setup", response_model=AISetupResponse)
async def setup_ai(
    config_data: AIConfigCreate,
    current_user: User = Depends(require_permissions("manage_ai_config")),
    db: Session = Depends(get_db)
):
    """Setup AI configuration for the current user's organization"""
    try:
        logger.info("Setting up AI config")
        
        # Validate model selection based on provider
        validate_model_selection(config_data.model_type, config_data.model_name)
        
        # Check if this is a custom model setup (not ChatterMate)
        is_custom_model = not (config_data.model_type.lower() == 'chattermate' and config_data.model_name.lower() == 'chattermate')

        # Check feature access for custom models
        if is_custom_model:
            check_custom_models_feature_access(current_user, db)

        # The managed model, backed by the operator's own provider account.
        # Deliberately ungated: it is the option a tenant on any plan can use, and
        # their consumption is capped by their plan's message allowance instead.
        if not HAS_ENTERPRISE and not is_custom_model:
            return _setup_platform_model(db, current_user)

        # Check if using ChatterMate model
        if HAS_ENTERPRISE and config_data.model_type.lower() == 'chattermate' and config_data.model_name.lower() == 'chattermate':
            # Use Groq as provider with keys from env
            model_type = AIModelType.CHATTERMATE
            model_name = os.getenv('CHATTERMATE_MODEL_NAME', 'gpt-4o-mini')
            api_key = os.getenv('CHATTERMATE_API_KEY', '')
        
            if not api_key:
                logger.error("ChatterMate API key not found in environment")
                raise HTTPException(
                        status_code=500,
                        detail="ChatterMate API configuration missing"
                )
                
            # Create AI configuration
            ai_config_repo = AIConfigRepository(db)
            ai_config = ai_config_repo.create_config(
                org_id=current_user.organization_id,
                model_type=model_type,
                model_name=model_name,
                api_key=api_key
            )
            
            # Prepare response
            response = AISetupResponse(
                message="AI configuration completed successfully",
                config=AIConfigResponse(
                    id=ai_config.id,
                    organization_id=ai_config.organization_id,
                    model_type=ai_config.model_type,
                    model_name=ai_config.model_name,
                    is_active=ai_config.is_active,
                    settings=ai_config.settings
                )
            )
            
            logger.debug(
                f"ChatterMate AI setup completed for org {current_user.organization_id}")
            return response
        
        # Regular custom model setup
        # Test API key before creating config
        try:
            # Live-validate the key+model for any BYO-key provider. This is also
            # what catches an invalid custom (typed) model ID.
            model_type_upper = config_data.model_type.upper()
            if is_known_provider(model_type_upper):
                is_valid = await ChatAgent.test_api_key(
                    api_key=config_data.api_key.get_secret_value(),
                    model_type=config_data.model_type,
                    model_name=config_data.model_name
                )
                if not is_valid:
                    raise HTTPException(
                        status_code=400,
                        detail={
                            "error": "Invalid API key",
                            "type": "invalid_api_key",
                            "details": "The provided API key is invalid or does not have access to the selected model."
                        }
                    )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "API key validation failed",
                    "type": "api_key_validation_error",
                    "details": str(e)
                }
            )


        # Create AI configuration
        ai_config_repo = AIConfigRepository(db)
        ai_config = ai_config_repo.create_config(
            org_id=current_user.organization_id,
            model_type=config_data.model_type,
            model_name=config_data.model_name,
            api_key=config_data.api_key.get_secret_value()
        )

        # Prepare response
        response = AISetupResponse(
            message="AI configuration completed successfully",
            config=AIConfigResponse(
                id=ai_config.id,
                organization_id=ai_config.organization_id,
                model_type=ai_config.model_type,
                model_name=ai_config.model_name,
                is_active=ai_config.is_active,
                settings=ai_config.settings
            )
        )

        logger.info(
            f"AI setup completed for org {current_user.organization_id}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        logger.error(f"AI setup error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to setup AI configuration"
        )


@router.get("/config", response_model=AIConfigResponse)
async def get_organization_ai_config(
    current_user: User = Depends(require_permissions("view_ai_config")),
    db: Session = Depends(get_db)
):
    """Get active AI configuration for the current user's organization"""
    try:
        ai_config_repo = AIConfigRepository(db)
        ai_config = ai_config_repo.get_active_config(
            current_user.organization_id)

        if not ai_config:
            raise HTTPException(
                status_code=404,
                detail="No active AI configuration found"
            )

        return AIConfigResponse(
            id=ai_config.id,
            organization_id=ai_config.organization_id,
            model_type=ai_config.model_type,
            model_name=ai_config.model_name,
            is_active=ai_config.is_active,
            settings=ai_config.settings
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting AI config: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get AI configuration"
        )


@router.get("/voice-config", response_model=VoiceConfigResponse)
async def get_voice_config(
    current_user: User = Depends(require_permissions("view_ai_config")),
    db: Session = Depends(get_db),
):
    ai_config = AIConfigRepository(db).get_active_config(current_user.organization_id)
    if not ai_config:
        raise HTTPException(status_code=404, detail="No active AI configuration found")
    voice = (ai_config.settings or {}).get("voice", {})
    return VoiceConfigResponse(
        enabled=bool(voice.get("enabled", False)),
        model_name=voice.get("model_name", "gemini-3.8-live"),
        voice_name=voice.get("voice_name", "Aoede"),
        has_api_key=bool(
            voice.get("encrypted_api_key")
            or (ai_config.model_type == AIModelType.GOOGLE and ai_config.encrypted_api_key)
        ),
    )


@router.put("/voice-config", response_model=VoiceConfigResponse)
async def update_voice_config(
    voice_data: VoiceConfigUpdate,
    current_user: User = Depends(require_permissions("manage_ai_config")),
    db: Session = Depends(get_db),
):
    ai_config_repo = AIConfigRepository(db)
    ai_config = ai_config_repo.get_active_config(current_user.organization_id)
    if not ai_config:
        raise HTTPException(status_code=404, detail="No active AI configuration found")
    if not voice_data.model_name.strip().startswith("gemini-"):
        raise HTTPException(status_code=400, detail="Enter a valid Gemini Live model ID")

    settings_data = dict(ai_config.settings or {})
    existing_voice = dict(settings_data.get("voice", {}))
    encrypted_voice_key = existing_voice.get("encrypted_api_key")
    if voice_data.api_key is not None:
        raw_voice_key = voice_data.api_key.get_secret_value().strip()
        if raw_voice_key:
            encrypted_voice_key = encrypt_api_key(raw_voice_key)

    # Backwards compatibility: an organization that previously used Gemini for
    # text already supplied a Google key. Copy it into the voice settings once,
    # so later changing the text provider does not break voice calls.
    if not encrypted_voice_key and ai_config.model_type == AIModelType.GOOGLE:
        encrypted_voice_key = ai_config.encrypted_api_key

    if voice_data.enabled and not encrypted_voice_key:
        raise HTTPException(
            status_code=400,
            detail="Enter a Google Gemini API key before enabling web voice calls",
        )

    settings_data["voice"] = {
        "enabled": voice_data.enabled,
        "model_name": voice_data.model_name.strip(),
        "voice_name": voice_data.voice_name.strip() or "Aoede",
        "encrypted_api_key": encrypted_voice_key,
    }
    ai_config_repo.update_config(ai_config.id, settings=settings_data)
    return VoiceConfigResponse(
        enabled=voice_data.enabled,
        model_name=voice_data.model_name.strip(),
        voice_name=voice_data.voice_name.strip() or "Aoede",
        has_api_key=bool(encrypted_voice_key),
    )


@router.put("/config", response_model=AISetupResponse)
async def update_ai_config(
    config_data: AIConfigUpdate,
    current_user: User = Depends(require_permissions("manage_ai_config")),
    db: Session = Depends(get_db)
):
    """Update AI configuration for the current user's organization"""
    try:
        logger.info(f"Updating AI config for org {current_user.organization_id}")
        
        # Validate model selection based on provider
        validate_model_selection(config_data.model_type, config_data.model_name)
        
        # Check if this is a custom model setup (not ChatterMate)
        is_custom_model = not (config_data.model_type.lower() == 'chattermate' and config_data.model_name.lower() == 'chattermate')
        
        # Check feature access for custom models
        if is_custom_model:
            check_custom_models_feature_access(current_user, db)
        
        # Get current config
        ai_config_repo = AIConfigRepository(db)
        current_config = ai_config_repo.get_active_config(current_user.organization_id)
        
        if not current_config:
            raise HTTPException(
                status_code=404,
                detail="No active AI configuration found to update"
            )

        # Switching to the managed model. create_config deactivates the previous
        # row rather than mutating it, so a tenant moving off their own key does
        # not leave that key sitting on a live record.
        if not HAS_ENTERPRISE and not is_custom_model:
            return _setup_platform_model(db, current_user)

        # Moving from the managed model back to their own key: the row must stop
        # being platform-managed, or their own spend would keep being metered
        # against the platform's budget.
        if current_config.is_platform_managed:
            current_config.is_platform_managed = False

        # Check if using ChatterMate model
        if HAS_ENTERPRISE and config_data.model_type.lower() == 'chattermate' and config_data.model_name.lower() == 'chattermate':
            # Use Groq as provider with keys from env
            model_type = AIModelType.CHATTERMATE
            model_name = os.getenv('CHATTERMATE_MODEL_NAME', 'gpt-4o-mini')
            api_key = os.getenv('CHATTERMATE_API_KEY', '')
            
            if not api_key:
                logger.error("ChatterMate API key not found in environment")
                raise HTTPException(
                    status_code=500,
                    detail="ChatterMate API configuration missing"
                )
                
            # Update AI configuration
            updated_config = ai_config_repo.update_config(
                config_id=current_config.id,
                model_type=model_type,
                model_name=model_name,
                api_key=api_key
            )
            
            logger.info(f"ChatterMate AI config updated for org {current_user.organization_id}")
        else:
            # For custom model, validate API key first if provided
            if config_data.api_key:
                model_type_upper = config_data.model_type.upper()
                if is_known_provider(model_type_upper):
                    try:
                        is_valid = await ChatAgent.test_api_key(
                            api_key=config_data.api_key.get_secret_value(),
                            model_type=config_data.model_type,
                            model_name=config_data.model_name
                        )
                        if not is_valid:
                            raise HTTPException(
                                status_code=400,
                                detail={
                                    "error": "Invalid API key",
                                    "type": "invalid_api_key",
                                    "details": "The provided API key is invalid or does not have access to the selected model."
                                }
                            )
                    except Exception as e:
                        raise HTTPException(
                            status_code=400,
                            detail={
                                "error": "API key validation failed",
                                "type": "api_key_validation_error",
                                "details": str(e)
                            }
                        )
            
            # Determine the API key to use
            api_key = None  # None indicates no change
            if config_data.api_key:
                api_key = config_data.api_key.get_secret_value()
            
            # Update AI configuration
            updated_config = ai_config_repo.update_config(
                config_id=current_config.id,
                model_type=config_data.model_type,
                model_name=config_data.model_name,
                api_key=api_key
            )
            
            logger.info(f"AI config updated for org {current_user.organization_id}")
        
        # Prepare response
        response = AISetupResponse(
            message="AI configuration updated successfully",
            config=AIConfigResponse(
                id=updated_config.id,
                organization_id=updated_config.organization_id,
                model_type=updated_config.model_type,
                model_name=updated_config.model_name,
                is_active=updated_config.is_active,
                settings=updated_config.settings
            )
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI config update error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update AI configuration"
        )


def validate_model_selection(model_type: str, model_name: str):
    """Validate the chosen provider and that a model name is present.

    The catalog models are suggestions, not a hard allowlist — an org may enter a
    custom model ID for any known provider. So we only enforce that the provider is
    known and the model name is non-empty; the live API-key test (see setup/update)
    is what actually rejects a bad model ID.
    """

    # ChatterMate is a special case handled separately
    if model_type.upper() == "CHATTERMATE" and model_name.lower() == "chattermate":
        return True

    if not is_known_provider(model_type):
        valid_providers = ", ".join(p["value"] for p in list_providers())
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Unsupported provider",
                "type": "invalid_provider",
                "details": f"Currently only these providers are supported: {valid_providers}"
            }
        )

    if not model_name or not model_name.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid model selection",
                "type": "invalid_model",
                "details": "A model ID is required for the selected provider."
            }
        )

    return True
