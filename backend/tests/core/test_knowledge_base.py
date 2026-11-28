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

import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from app.knowledge.knowledge_base import KnowledgeManager
from app.models.knowledge import Knowledge, SourceType
from app.models.knowledge_to_agent import KnowledgeToAgent
from uuid import UUID, uuid4
import os
from agno.vectordb.pgvector import PgVector, SearchType

@pytest.fixture
def mock_db():
    """Create a mock database session"""
    db = MagicMock()
    return db

@pytest.fixture
def mock_ai_config():
    """Create a mock AI config"""
    config = MagicMock()
    config.encrypted_api_key = "encrypted_key"
    return config

@pytest.fixture
def mock_knowledge():
    """Create a mock knowledge entry"""
    knowledge_id = uuid4()
    org_id = uuid4()
    return Knowledge(
        id=knowledge_id,
        organization_id=org_id,
        source="test_source",
        source_type=SourceType.FILE,
        table_name="test_table",
        schema="test_schema"
    )

@pytest.fixture
def mock_vector_db():
    """Create a mock vector database"""
    vector_db = MagicMock(spec=PgVector)
    vector_db.table_name = "test_table"
    vector_db.schema = "test_schema"
    return vector_db

@pytest.fixture
def knowledge_manager(mock_db, mock_ai_config, mock_vector_db):
    """Create a KnowledgeManager instance with mocked dependencies"""
    org_id = uuid4()
    agent_id = uuid4()
    
    with patch('app.knowledge.knowledge_base.SessionLocal') as mock_session_local, \
         patch('app.knowledge.knowledge_base.AIConfigRepository') as mock_ai_config_repo, \
         patch('app.knowledge.knowledge_base.OptimizedPgVector') as mock_pg_vector, \
         patch('app.knowledge.knowledge_base.KnowledgeRepository') as mock_knowledge_repo, \
         patch('app.knowledge.knowledge_base.KnowledgeToAgentRepository') as mock_link_repo:
        
        # Configure basic mocks
        mock_session_local.return_value.__enter__.return_value = mock_db
        mock_ai_config_repo.return_value.get_active_config.return_value = mock_ai_config
        mock_pg_vector.return_value = mock_vector_db
        
        # Configure repository mocks
        mock_knowledge_repo_instance = MagicMock()
        mock_link_repo_instance = MagicMock()
        mock_knowledge_repo.return_value = mock_knowledge_repo_instance
        mock_link_repo.return_value = mock_link_repo_instance
        
        manager = KnowledgeManager(org_id=org_id, agent_id=str(agent_id))
        
        # Replace repository instances with mocks
        manager.knowledge_repo = mock_knowledge_repo_instance
        manager.link_repo = mock_link_repo_instance
        
        return manager

@pytest.mark.asyncio
async def test_add_pdf_urls_success(knowledge_manager, mock_knowledge):
    """Test successful addition of PDF URLs"""
    # Setup
    urls = ["http://example.com/test.pdf"]
    
    with patch('app.knowledge.knowledge_base.EnhancedPDFUrlKnowledgeBase') as mock_pdf_kb, \
         patch.object(knowledge_manager, '_add_knowledge_source', return_value=mock_knowledge) as mock_add_source:
        # Configure mock
        mock_pdf_kb_instance = MagicMock()
        mock_pdf_kb.return_value = mock_pdf_kb_instance
        
        # Execute
        result = await knowledge_manager.add_pdf_urls(urls)
        
        # Assert
        assert result is True
        mock_pdf_kb.assert_called_once()
        mock_pdf_kb_instance.load.assert_called_once()
        mock_add_source.assert_called_once()

@pytest.mark.asyncio
async def test_add_pdf_urls_failure(knowledge_manager):
    """Test failure in adding PDF URLs"""
    # Setup
    urls = ["http://example.com/test.pdf"]
    
    with patch('app.knowledge.knowledge_base.EnhancedPDFUrlKnowledgeBase') as mock_pdf_kb:
        # Configure mock to raise exception
        mock_pdf_kb.side_effect = Exception("Failed to load PDF")
        
        with pytest.raises(RuntimeError, match="PDF URL processing failed"):
            await knowledge_manager.add_pdf_urls(urls)

@pytest.mark.asyncio
async def test_add_websites_success(knowledge_manager, mock_knowledge):
    """Test successful addition of websites"""
    # Setup
    urls = ["http://example.com"]
    max_links = 5
    
    with patch('app.knowledge.knowledge_base.EnhancedWebsiteKnowledgeBase') as mock_web_kb, \
         patch.object(knowledge_manager, '_add_knowledge_source', return_value=mock_knowledge) as mock_add_source:
        # Configure mock
        mock_web_kb_instance = MagicMock()
        mock_web_kb.return_value = mock_web_kb_instance
        
        # Execute
        result = await knowledge_manager.add_websites(urls, max_links)
        
        # Assert
        assert result is True
        mock_web_kb.assert_called_once()
        mock_web_kb_instance.load.assert_called_once()
        mock_add_source.assert_called_once()

@pytest.mark.asyncio
async def test_add_pdf_files_success(knowledge_manager, mock_knowledge):
    """Test successful addition of PDF files"""
    # Setup
    files = ["/path/to/test.pdf"]

    with patch('app.knowledge.knowledge_base.EnhancedPDFKnowledgeBase') as mock_pdf_kb, \
         patch('app.knowledge.knowledge_base.PDFImageReader') as mock_pdf_reader, \
         patch('os.path.exists') as mock_exists, \
         patch('os.path.getsize') as mock_getsize, \
         patch('os.path.basename') as mock_basename, \
         patch('os.path.splitext') as mock_splitext, \
         patch.object(knowledge_manager, '_add_knowledge_source', return_value=mock_knowledge) as mock_add_source:
        # Configure mocks
        mock_pdf_kb_instance = MagicMock()
        mock_pdf_kb.return_value = mock_pdf_kb_instance
        mock_exists.return_value = True
        mock_getsize.return_value = 1024
        mock_basename.return_value = "test.pdf"
        mock_splitext.return_value = ("test", ".pdf")

        # Execute
        result = await knowledge_manager.add_pdf_files(files)

        # Assert
        assert result is True
        mock_pdf_kb.assert_called_once()
        mock_pdf_kb_instance.load.assert_called_once()
        mock_add_source.assert_called_once()

@pytest.mark.asyncio
async def test_add_pdf_files_uses_image_reader_after_empty_text_extraction(
    knowledge_manager, mock_knowledge
):
    """Image-only PDFs should retry with OCR instead of being marked complete."""
    files = ["/path/to/scan.pdf"]

    with patch('app.knowledge.knowledge_base.EnhancedPDFKnowledgeBase') as mock_pdf_kb, \
         patch('app.knowledge.knowledge_base.PDFImageReader') as mock_image_reader, \
         patch('os.path.exists', return_value=True), \
         patch('os.path.getsize', return_value=1024), \
         patch('os.path.basename', return_value="scan.pdf"), \
         patch('os.path.splitext', return_value=("scan", ".pdf")), \
         patch.object(
             knowledge_manager, '_add_knowledge_source', return_value=mock_knowledge
         ) as mock_add_source:
        text_kb = MagicMock()
        text_kb.load.side_effect = ValueError("No readable text was extracted from the PDF")
        image_kb = MagicMock()
        mock_pdf_kb.side_effect = [text_kb, image_kb]

        result = await knowledge_manager.add_pdf_files(files)

        assert result is True
        assert mock_pdf_kb.call_count == 2
        mock_image_reader.assert_called_once()
        image_kb.load.assert_called_once()
        mock_add_source.assert_called_once()

@pytest.mark.asyncio
async def test_add_pdf_files_surfaces_processing_error(knowledge_manager):
    """Both reader failures should retain an actionable queue error."""
    files = ["/path/to/broken.pdf"]

    with patch('app.knowledge.knowledge_base.EnhancedPDFKnowledgeBase') as mock_pdf_kb, \
         patch('os.path.exists', return_value=True), \
         patch('os.path.getsize', return_value=1024):
        kb = MagicMock()
        kb.load.side_effect = ValueError("No readable text was extracted from the PDF")
        mock_pdf_kb.return_value = kb

        with pytest.raises(RuntimeError, match="PDF processing failed"):
            await knowledge_manager.add_pdf_files(files)

def test_get_knowledge_base_for_agent(knowledge_manager, mock_knowledge):
    """Test getting knowledge base for a specific agent"""
    # Setup
    mock_knowledge.agent_links = [
        MagicMock(agent_id=knowledge_manager.agent_id)
    ]
    
    with patch('app.knowledge.knowledge_base.KnowledgeRepository') as mock_knowledge_repo_class:
        mock_knowledge_repo_instance = MagicMock()
        mock_knowledge_repo_class.return_value = mock_knowledge_repo_instance
        mock_knowledge_repo_instance.get_by_agent.return_value = [mock_knowledge]
        
        # Execute
        result = knowledge_manager.get_knowledge_base()
        
        # Assert
        assert len(result) == 1
        assert result[0]['id'] == mock_knowledge.id
        assert result[0]['source'] == mock_knowledge.source
        assert result[0]['source_type'] == mock_knowledge.source_type
        mock_knowledge_repo_instance.get_by_agent.assert_called_once_with(knowledge_manager.agent_id)

def test_get_knowledge_base_for_org(knowledge_manager, mock_knowledge):
    """Test getting knowledge base for an organization"""
    # Setup
    knowledge_manager.agent_id = None
    mock_knowledge.agent_links = []
    
    with patch('app.knowledge.knowledge_base.KnowledgeRepository') as mock_knowledge_repo_class:
        mock_knowledge_repo_instance = MagicMock()
        mock_knowledge_repo_class.return_value = mock_knowledge_repo_instance
        mock_knowledge_repo_instance.get_by_org.return_value = [mock_knowledge]
        
        # Execute
        result = knowledge_manager.get_knowledge_base()
        
        # Assert
        assert len(result) == 1
        assert result[0]['id'] == mock_knowledge.id
        assert result[0]['source'] == mock_knowledge.source
        assert result[0]['source_type'] == mock_knowledge.source_type
        mock_knowledge_repo_instance.get_by_org.assert_called_once_with(knowledge_manager.org_id)

@pytest.mark.asyncio
async def test_process_knowledge_pdf_file(knowledge_manager):
    """Test processing PDF file knowledge"""
    # Setup
    queue_item = MagicMock()
    queue_item.id = 123  # ensure a real integer ID to avoid DB adapter issues
    queue_item.source_type = "pdf_file"
    queue_item.source = "/path/to/test.pdf"
    
    with patch.object(knowledge_manager, 'add_pdf_files') as mock_add_pdf_files, \
         patch('os.path.exists') as mock_exists, \
         patch('os.remove') as mock_remove, \
         patch('app.knowledge.knowledge_base.KnowledgeQueueRepository') as mock_queue_repo_cls:
        # Configure mocks
        mock_add_pdf_files.return_value = True
        mock_exists.return_value = True
        mock_queue_repo = MagicMock()
        mock_queue_repo.update_progress.return_value = True
        mock_queue_repo.update_status.return_value = True
        mock_queue_repo_cls.return_value = mock_queue_repo
        
        # Execute
        result = await knowledge_manager.process_knowledge(queue_item)
        
        # Assert
        assert result is True
        mock_add_pdf_files.assert_called_once_with([queue_item.source])
        mock_exists.assert_called_once_with(queue_item.source)
        mock_remove.assert_called_once_with(queue_item.source)

@pytest.mark.asyncio
async def test_process_knowledge_pdf_failure_is_not_marked_complete(knowledge_manager):
    queue_item = MagicMock()
    queue_item.id = 123
    queue_item.source_type = "pdf_file"
    queue_item.source = "/path/to/broken.pdf"

    with patch.object(
        knowledge_manager, 'add_pdf_files', side_effect=RuntimeError("PDF extraction failed")
    ), patch('os.remove') as mock_remove, patch(
        'app.knowledge.knowledge_base.KnowledgeQueueRepository'
    ) as mock_queue_repo_cls:
        mock_queue_repo = MagicMock()
        mock_queue_repo_cls.return_value = mock_queue_repo

        with pytest.raises(RuntimeError, match="PDF extraction failed"):
            await knowledge_manager.process_knowledge(queue_item)

        mock_queue_repo.update_status.assert_not_called()
        mock_remove.assert_not_called()

@pytest.mark.asyncio
async def test_process_knowledge_unsupported_type(knowledge_manager):
    """Test processing unsupported knowledge type"""
    # Setup
    queue_item = MagicMock()
    queue_item.source_type = "unsupported_type"
    
    # Execute and Assert
    with pytest.raises(ValueError, match="Unsupported source type: unsupported_type"):
        await knowledge_manager.process_knowledge(queue_item)
