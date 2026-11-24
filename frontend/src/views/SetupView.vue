<!--
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
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { OrganizationCreate } from '@/types/organization'
import { createOrganization, getSetupStatus } from '@/services/organization'
import { userService } from '@/services/user'
import { validatePassword, validateDomain, validateEmail, validateName, validateOrgName, type PasswordStrength } from '@/utils/validators'
import { extractApiError } from '@/utils/apiError'
import InstallPrompt from '@/components/pwa/InstallPrompt.vue'
import LegalLinks from '@/components/common/LegalLinks.vue'
// @ts-ignore
import { clientTz } from 'timezone-select-js'
import type { BusinessHoursDict } from '@/types/organization'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const checkingOrganization = ref(true)

// Set once the account exists but no session was issued, because this
// deployment requires the address to be verified first.
const awaitingVerification = ref(false)
const verificationEmailSent = ref(false)
const submittedEmail = ref('')

// This view serves two jobs: first-run setup, and ongoing self-serve signup at
// /signup. It used to bounce anonymous visitors to /login as soon as ANY
// organization existed — correct while the backend allowed only one, but now
// that each visitor creates their own workspace that redirect would make signup
// unreachable for everyone after the first customer. Only an already
// authenticated user is sent away, since they have a workspace already.
onMounted(async () => {
    try {
        if (userService.isAuthenticated() && await getSetupStatus()) {
            router.push('/ai-agents')
        }
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to check organization status'
    } finally {
        checkingOrganization.value = false
    }
})

// Sent with the signup but not asked for on this screen.
//
// Business hours previously occupied a seven-row grid of toggles and time
// selects — by far the largest thing on the page, and asked before the customer
// had seen the product at all. The defaults below are the common case, the
// timezone is read from the browser, and both are editable under
// Settings → Organization. Nothing is lost by not asking here, and the form
// now reads as the same short, single-column pane as the sign-in screen.
const defaultBusinessHours: BusinessHoursDict = {
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    wednesday: { start: '09:00', end: '17:00', enabled: true },
    thursday: { start: '09:00', end: '17:00', enabled: true },
    friday: { start: '09:00', end: '17:00', enabled: true },
    saturday: { start: '09:00', end: '17:00', enabled: false },
    sunday: { start: '09:00', end: '17:00', enabled: false }
}

const orgData = ref<OrganizationCreate>({
    name: '',
    domain: '',
    admin_email: '',
    admin_name: '',
    admin_password: '',
    timezone: clientTz(),
    business_hours: defaultBusinessHours,
    settings: {}
})

const confirmPassword = ref('')
const passwordTouched = ref(false)
const passwordStrength = ref<PasswordStrength>({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
})

const domainTouched = ref(false)
const isDomainValid = ref(false)
const orgNameTouched = ref(false)
const isOrgNameValid = ref(false)
const adminNameTouched = ref(false)
const isAdminNameValid = ref(false)
const emailTouched = ref(false)
const isEmailValid = ref(false)
const confirmTouched = ref(false)

const passwordsMatch = computed(
    () => confirmPassword.value.length > 0 && orgData.value.admin_password === confirmPassword.value
)

// Every requirement in the checklist below is one the backend also enforces via
// validate_password_strength(). Keeping the two in step matters: when the UI
// asked for 8 characters and the API demanded 10, signup failed with a message
// that contradicted the checklist the user had just satisfied.
const passwordMeetsPolicy = computed(() =>
    passwordStrength.value.hasMinLength &&
    passwordStrength.value.hasUpperCase &&
    passwordStrength.value.hasLowerCase &&
    passwordStrength.value.hasNumber &&
    passwordStrength.value.hasSpecialChar
)

const handleOrgNameInput = (name: string) => {
    if (!orgNameTouched.value && name.length > 0) orgNameTouched.value = true
    isOrgNameValid.value = validateOrgName(name)
}

const handleAdminNameInput = (name: string) => {
    if (!adminNameTouched.value && name.length > 0) adminNameTouched.value = true
    isAdminNameValid.value = validateName(name)
}

const handleEmailInput = (email: string) => {
    if (!emailTouched.value && email.length > 0) emailTouched.value = true
    isEmailValid.value = validateEmail(email)
}

const handlePasswordInput = (password: string) => {
    if (!passwordTouched.value && password.length > 0) passwordTouched.value = true
    passwordStrength.value = validatePassword(password)
}

const handleDomainInput = (domain: string) => {
    if (!domainTouched.value && domain.length > 0) domainTouched.value = true
    isDomainValid.value = validateDomain(domain)
}

const handleSubmit = async () => {
    if (!isOrgNameValid.value) {
        error.value = 'Please enter a valid workspace name'
        return
    }
    if (!isDomainValid.value) {
        error.value = 'Please enter a valid domain, like example.com'
        return
    }
    if (!isAdminNameValid.value) {
        error.value = 'Please enter your full name'
        return
    }
    if (!isEmailValid.value) {
        error.value = 'Please enter a valid email address'
        return
    }
    if (!passwordMeetsPolicy.value) {
        error.value = 'Password does not meet all the requirements listed'
        return
    }
    if (orgData.value.admin_password !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
    }

    loading.value = true
    error.value = ''

    try {
        const result = await createOrganization(orgData.value)
        if (result.email_verification_required) {
            submittedEmail.value = orgData.value.admin_email
            verificationEmailSent.value = result.email_verification_sent !== false
            awaitingVerification.value = true
            return
        }
        router.push('/ai-agents')
    } catch (e) {
        // extractApiError, not e.message: axios puts a generic "Request failed
        // with status code 409" on the Error, while the reason the user needs
        // ("that email is already registered") is in response.data.detail.
        error.value = extractApiError(e, 'Failed to create workspace')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div v-if="!checkingOrganization" class="auth-page">
        <!-- Left: form panel -->
        <div class="form-panel">
            <div class="auth-logo">
                <div class="logo-mark">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <span class="logo-word">Growmiq mini</span>
            </div>

            <!-- Post-signup state: the account exists, the session does not. -->
            <template v-if="awaitingVerification">
                <h1 class="auth-title">Check your inbox</h1>
                <p class="auth-sub">
                    <template v-if="verificationEmailSent">
                        We sent a verification link to <strong>{{ submittedEmail }}</strong>.
                        Click it to activate your workspace and sign in.
                    </template>
                    <template v-else>
                        Your workspace was created, but we couldn't send the verification
                        email. Contact support and we'll activate it for you.
                    </template>
                </p>
                <div class="auth-form">
                    <router-link to="/login" class="auth-submit as-link">Back to sign in</router-link>
                    <p class="signup-prompt">
                        Wrong address, or nothing arrived?
                        <router-link to="/login" class="signup-link">Sign in to resend</router-link>
                    </p>
                </div>
            </template>

            <template v-else>
                <h1 class="auth-title">Create your workspace</h1>
                <p class="auth-sub">Your AI support agent, live in a few minutes</p>

                <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
                    <div class="field">
                        <label for="orgName">Workspace name</label>
                        <input id="orgName" v-model="orgData.name" type="text" required
                               :class="{ invalid: orgNameTouched && !isOrgNameValid }"
                               @input="handleOrgNameInput(orgData.name)"
                               placeholder="Acme Inc." autocomplete="organization" />
                        <p v-if="orgNameTouched && !isOrgNameValid" class="field-error">
                            Use 2–100 characters: letters, numbers, spaces, and - ' &amp; .
                        </p>
                    </div>

                    <div class="field">
                        <label for="domain">Company domain</label>
                        <input id="domain" v-model="orgData.domain" type="text" required
                               :class="{ invalid: domainTouched && !isDomainValid }"
                               @input="handleDomainInput(orgData.domain)"
                               placeholder="acme.com" autocomplete="url" />
                        <p v-if="domainTouched && !isDomainValid" class="field-error">
                            Enter a domain like acme.com — no https:// or trailing slash.
                        </p>
                    </div>

                    <div class="field">
                        <label for="adminName">Your name</label>
                        <input id="adminName" v-model="orgData.admin_name" type="text" required
                               :class="{ invalid: adminNameTouched && !isAdminNameValid }"
                               @input="handleAdminNameInput(orgData.admin_name)"
                               placeholder="Alex Morgan" autocomplete="name" />
                        <p v-if="adminNameTouched && !isAdminNameValid" class="field-error">
                            Use 2–100 characters: letters, numbers, spaces, hyphens and apostrophes.
                        </p>
                    </div>

                    <div class="field">
                        <label for="adminEmail">Work email</label>
                        <input id="adminEmail" v-model="orgData.admin_email" type="email" required
                               :class="{ invalid: emailTouched && !isEmailValid }"
                               @input="handleEmailInput(orgData.admin_email)"
                               placeholder="you@acme.com" autocomplete="email" />
                        <p v-if="emailTouched && !isEmailValid" class="field-error">
                            Please enter a valid email address.
                        </p>
                    </div>

                    <div class="field">
                        <label for="adminPassword">Password</label>
                        <input id="adminPassword" v-model="orgData.admin_password" type="password" required
                               @input="handlePasswordInput(orgData.admin_password)"
                               placeholder="••••••••" autocomplete="new-password" />
                        <div v-if="passwordTouched" class="pw-meter">
                            <div class="pw-track">
                                <div class="pw-fill"
                                     :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                                     :class="passwordStrength.score < 3 ? 'weak' : passwordStrength.score < 5 ? 'medium' : 'strong'"></div>
                            </div>
                            <ul class="pw-reqs">
                                <li :class="{ met: passwordStrength.hasMinLength }">At least 8 characters</li>
                                <li :class="{ met: passwordStrength.hasUpperCase }">An uppercase letter</li>
                                <li :class="{ met: passwordStrength.hasLowerCase }">A lowercase letter</li>
                                <li :class="{ met: passwordStrength.hasNumber }">A number</li>
                                <li :class="{ met: passwordStrength.hasSpecialChar }">A special character (!@#$%^&amp;*)</li>
                            </ul>
                        </div>
                    </div>

                    <div class="field">
                        <label for="confirmPassword">Confirm password</label>
                        <input id="confirmPassword" v-model="confirmPassword" type="password" required
                               :class="{ invalid: confirmTouched && !passwordsMatch }"
                               @blur="confirmTouched = true"
                               placeholder="••••••••" autocomplete="new-password" />
                        <p v-if="confirmTouched && !passwordsMatch" class="field-error">
                            Passwords do not match.
                        </p>
                    </div>

                    <div v-if="error" class="auth-error" role="alert">{{ error }}</div>

                    <button type="submit" class="auth-submit" :disabled="loading">
                        <span v-if="loading">Creating workspace…</span>
                        <span v-else>Create workspace</span>
                    </button>

                    <p class="legal-note">
                        Your timezone is detected automatically and business hours start at
                        9–5, Monday to Friday. Both are editable in settings later.
                    </p>

                    <p class="legal-note">
                        By creating a workspace, you agree to the
                        <a href="/terms.html" class="signup-link">Terms of Service</a>.
                        See our <a href="/privacy.html" class="signup-link">Privacy Policy</a>
                        for how we handle your information.
                    </p>

                    <p class="signup-prompt">
                        Already have an account?
                        <router-link to="/login" class="signup-link">Sign in</router-link>
                    </p>
                </form>
            </template>

            <LegalLinks />
            <div class="install-hint-slot">
                <InstallPrompt />
            </div>
        </div>

        <!-- Right: brand panel with aurora -->
        <div class="brand-panel">
            <div class="aurora-blob blob-lime"></div>
            <div class="aurora-blob blob-purple"></div>
            <div class="aurora-blob blob-teal"></div>

            <div class="brand-copy">
                <div class="orb">
                    <div class="orb-glow"></div>
                    <div class="orb-gradient"></div>
                    <div class="orb-core"></div>
                    <div class="orb-ring"></div>
                </div>

                <div class="brand-badge">
                    <span class="badge-dot"></span>
                    open source · MCP-native
                </div>

                <h2>Your first agent, <em>before lunch.</em></h2>
                <p class="brand-lede">Point it at your docs, drop one script tag on your site, and it starts answering. No training data to prepare, no model to fine-tune.</p>

                <ul class="feature-list">
                    <li><span class="check">✓</span> Drop in a PDF or URL — it learns the rest</li>
                    <li><span class="check">✓</span> Escalates to your team with full context</li>
                    <li><span class="check">✓</span> Bring your own model, or use ours</li>
                </ul>
            </div>
        </div>
    </div>

    <div v-else class="loading-screen">
        <div class="loading-spinner"></div>
    </div>
</template>

<style scoped>
/* Deliberately the same structure and tokens as LoginView: sign-in and sign-up
   are one continuous surface, and a customer moving between them should not
   feel a seam. */
.auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.02fr .98fr;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
}

/* ── Form panel ── */
.form-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 56px;
    background: var(--bg);
    min-height: 100vh;
    min-height: 100dvh;
}

.install-hint-slot {
    display: none;
    margin-top: var(--space-lg);
    padding-bottom: var(--safe-bottom);
}

@media (max-width: 768px) {
    .install-hint-slot { display: block; }
}

.auth-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
}

.logo-mark {
    width: 32px;
    height: 32px;
    background: var(--accent-solid);
    border-radius: 10px 10px 10px 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3.5px;
    flex-shrink: 0;
}

.dot {
    width: 4.5px;
    height: 4.5px;
    background: var(--on-accent);
    border-radius: 50%;
}

.logo-word {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
    color: var(--text);
}

.auth-title {
    font-family: var(--font-display);
    font-size: 40px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 10px;
    line-height: 1.1;
}

.auth-sub {
    color: var(--muted);
    font-size: 15px;
    margin-bottom: 32px;
    max-width: 400px;
    line-height: 1.55;
}

.auth-sub strong { color: var(--text); font-weight: 600; }

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 400px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.field label {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text3);
}

.field input {
    width: 100%;
    padding: 14px 16px;
    background: var(--o04);
    border: 1px solid var(--o12);
    border-radius: 12px;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 15px;
    transition: border-color 0.18s, box-shadow 0.18s;
}

.field input::placeholder { color: var(--faint); }

.field input:focus {
    outline: none;
    border-color: var(--accent-ink);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-ink) 15%, transparent);
}

.field input.invalid {
    border-color: color-mix(in srgb, var(--c-coral) 60%, transparent);
}

.field input:-webkit-autofill,
.field input:-webkit-autofill:hover,
.field input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px var(--bg2) inset !important;
    -webkit-text-fill-color: var(--text) !important;
    caret-color: var(--text);
    border: 1px solid var(--o12) !important;
    transition: background-color 9999s ease-in-out 0s;
}

.field-error {
    font-size: 12.5px;
    color: var(--c-coral);
    margin: 0;
}

/* Password strength */
.pw-meter { margin-top: 4px; }

.pw-track {
    height: 4px;
    background: var(--o08);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 10px;
}

.pw-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.22s ease, background-color 0.22s ease;
}

.pw-fill.weak { background: var(--c-coral); }
.pw-fill.medium { background: #e0b341; }
.pw-fill.strong { background: var(--accent-solid); }

.pw-reqs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 3px;
    font-size: 12.5px;
    color: var(--muted2);
}

.pw-reqs li {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pw-reqs li::before {
    content: '○';
    font-size: 10px;
    color: var(--faint);
}

.pw-reqs li.met { color: var(--text3); }
.pw-reqs li.met::before { content: '●'; color: var(--accent-ink); }

.auth-error {
    color: var(--c-coral);
    background: color-mix(in srgb, var(--c-coral) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--c-coral) 20%, transparent);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13.5px;
}

.auth-submit {
    width: 100%;
    padding: 15px;
    background: var(--accent-solid);
    color: var(--on-accent-solid);
    border: none;
    border-radius: 12px;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: opacity 0.18s;
}

.auth-submit:hover:not(:disabled) { opacity: 0.88; }
.auth-submit:disabled { opacity: 0.45; cursor: not-allowed; }

/* Same pill as the submit button, used where the action is navigation */
.auth-submit.as-link {
    display: block;
    text-align: center;
    text-decoration: none;
}

.legal-note {
    font-size: 12.5px;
    line-height: 1.55;
    color: var(--faint);
    margin: -4px 0 0;
}

.signup-prompt {
    text-align: center;
    font-size: 14px;
    color: var(--muted2);
    margin: 0;
}

.signup-link {
    color: var(--accent-ink);
    text-decoration: none;
    font-weight: 500;
}
.signup-link:hover { text-decoration: underline; }

/* ── Brand panel ── */
.brand-panel {
    position: relative;
    background: linear-gradient(160deg, var(--bg-elevated), var(--bg-deep));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px 6vw;
    min-height: 100vh;
    border-left: 1px solid var(--o06);
}

.aurora-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: cm-aurora 14s ease-in-out infinite;
}

.blob-lime {
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, color-mix(in srgb, var(--accent-solid) 32%, transparent), color-mix(in srgb, var(--accent-solid) 6%, transparent));
    top: -80px;
    right: -60px;
    animation-duration: 16s;
}

.blob-purple {
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, color-mix(in srgb, var(--c-purple) 28%, transparent), color-mix(in srgb, var(--c-purple) 4%, transparent));
    top: 20%;
    left: -80px;
    animation-duration: 20s;
    animation-delay: -5s;
}

.blob-teal {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, color-mix(in srgb, var(--c-teal) 22%, transparent), color-mix(in srgb, var(--c-teal) 3%, transparent));
    bottom: 15%;
    right: 10%;
    animation-duration: 18s;
    animation-delay: -9s;
}

.brand-copy {
    position: relative;
    z-index: 1;
    max-width: 460px;
}

.orb {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 38px;
    animation: cm-float 7s ease-in-out infinite;
}

.orb-glow {
    position: absolute;
    inset: -36px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in srgb, var(--accent-solid) 20%, transparent), transparent 70%);
    filter: blur(10px);
}

.orb-gradient {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, var(--accent-solid), var(--c-purple), var(--c-teal), var(--c-coral), var(--accent-solid));
    filter: blur(6px);
    animation: cm-spin 6s linear infinite;
}

.orb-core {
    position: absolute;
    inset: 24px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--text) 92%, transparent), color-mix(in srgb, var(--text) 12%, transparent) 55%, transparent 72%);
    animation: cm-pulse 2.6s ease-in-out infinite;
}

.orb-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 26px color-mix(in srgb, var(--bg-deep) 55%, transparent);
}

.brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 7px 14px;
    border: 1px solid var(--o12);
    border-radius: 999px;
    background: var(--o03);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 26px;
}

.badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent-solid);
    box-shadow: 0 0 10px var(--accent-ink);
    animation: cm-pulse 2.6s ease-in-out infinite;
}

.brand-copy h2 {
    font-family: var(--font-display);
    font-size: 42px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text);
    line-height: 1.06;
    margin: 0 0 18px;
}

.brand-copy h2 em {
    font-style: normal;
    color: var(--accent-ink);
}

.brand-lede {
    font-size: 17px;
    line-height: 1.6;
    color: var(--muted);
    margin: 0 0 30px;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.feature-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: var(--text3);
}

.check {
    color: var(--accent-ink);
    font-weight: 700;
    font-size: 14px;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
    .auth-page { grid-template-columns: 1fr; }
    .brand-panel { display: none; }
}

@media (max-width: 600px) {
    .form-panel { padding: 40px 28px; }
    .auth-title { font-size: 30px; }
}

/* The form is taller than the sign-in form, so on short viewports it scrolls
   rather than being vertically centred and clipped at both ends. */
@media (max-height: 860px) {
    .form-panel { justify-content: flex-start; padding-top: 44px; padding-bottom: 44px; }
}

.loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--o12);
    border-radius: 50%;
    border-top-color: var(--accent-solid);
    animation: cm-spin 1s linear infinite;
}
</style>
