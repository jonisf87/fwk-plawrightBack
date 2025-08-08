# Playwright + Cucumber + TypeScript E2E Demo (Registration, Login & Parallel User Simulation)

Automated end-to-end tests for [demoqa.com/register](https://demoqa.com/register), [demoqa.com/login](https://demoqa.com/login), and [demoqa.com/automation-practice-form](https://demoqa.com/automation-practice-form) using Playwright, Cucumber (Gherkin), TypeScript, and the Page Object Model (POM) pattern.

**This suite covers all major flows:**
- User registration (happy/negative paths, robust CAPTCHA/API fallback)
- User login (happy/negative paths)
- **Parallel User Simulation:**
  - User 1: Fills and submits the automation practice form with random data, selects all hobbies, uploads a sample image, and submits the form. The test robustly detects the confirmation modal even if overlays or ads are present. Includes a negative scenario for invalid email, with UI and API fallback for validation.
  - User 2: Navigates to the sortable grid, goes to the Grid tab, and shuffles the grid items, verifying the order changes.
  - All flows are resilient to ad overlays, modals, and CAPTCHA interruptions. See `tests/features/parallelUsers.feature` and `tests/steps/ParallelUsers.steps.ts` for details.

**Sample Image:**
A sample image for upload is provided at `tests/fixtures/test-image.png`. You can replace it with any PNG/JPG file for testing.

# Playwright + Cucumber + TypeScript E2E Demo (Registration, Login & Parallel User Simulation)

Automated end-to-end tests for [demoqa.com/register](https://demoqa.com/register), [demoqa.com/login](https://demoqa.com/login), and [demoqa.com/automation-practice-form](https://demoqa.com/automation-practice-form) using Playwright, Cucumber (Gherkin), TypeScript, and the Page Object Model (POM) pattern.

**This suite covers all major flows:**
- User registration (happy/negative paths, robust CAPTCHA/API fallback)
- User login (happy/negative paths)
- Parallel User Simulation: two users in parallel, one filling the practice form (with overlays/modals/CAPTCHA handling), the other shuffling the sortable grid

The "Parallel User Simulation" scenario is a core part of this suite, demonstrating robust multi-user E2E automation and resilience to UI interruptions. See the section below for details.

## 📦 Folder Structure

```
/tests
  ├── /features        # Gherkin `.feature` files
  ├── /steps           # Cucumber step definitions
  ├── /pages           # Page Object Model classes (TypeScript)
  ├── /support         # Custom World, hooks, shared context
```




## 🚀 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Install Playwright browsers:**
   ```sh
   npx playwright install
   ```

3. **Run tests:**
   ```sh
   npm test
   ```



4. **Lint your code (optional but recommended):**
   ```sh
   npx eslint . --ext .ts --max-warnings=0
   ```

5. **Run E2E Login and Registration Tests:**
   ```sh
   npm test
   ```

5. **Generate Playwright code (optional):**
   ```sh
   npm run codegen
   ```



## 📝 Project Goals & Implementation Notes
- Automate registration, login, and parallel user flows (UI or API fallback if CAPTCHA or overlays block UI)
- Validate both successful and failed registrations (password regex) and logins (valid/invalid credentials)
- Store credentials for login reuse
- Use POM and Cucumber for maintainable, readable, and robust tests
- Ensure robust error message detection, credential handling, and modal/overlay resilience for all flows

---




## 🛠️ Implementation & Changes

- **Playwright browser installation required:**
  - After `npm install`, run `npx playwright install` to download browser binaries.


- **Registration, Login & Parallel User E2E Features:**
  - Feature files: `tests/features/registration.feature`, `tests/features/login.feature`, and `tests/features/parallelUsers.feature` cover registration, login, and parallel user flows, each with happy and negative scenarios.
  - Page Objects: `tests/pages/RegistrationPage.ts`, `tests/pages/LoginPage.ts`, `tests/pages/PracticeFormPage.ts`, and `tests/pages/SortablePage.ts` encapsulate UI actions and selectors for each flow. All selectors are up to date with the latest demoqa.com HTML (e.g., registration uses `input#firstname[placeholder="First Name"]`, etc.).
  - Step Definitions: `tests/steps/Registration.steps.ts`, `tests/steps/Login.steps.ts`, and `tests/steps/ParallelUsers.steps.ts` implement all steps, including credential reuse, robust error/modal detection, and API fallback. All code is now fully ESLint-compliant (no unused variables, no `any` types, no unused catch params).
  - Credentials are read from `tests/support/data.json` and support both `userName` and `username` keys for compatibility.
  - Error/modal detection is robust, supporting multiple selectors, retries, and fallback to API if UI is blocked by CAPTCHA or overlays. CAPTCHA handling in registration is fully automated: if UI registration is blocked, the test falls back to API registration and asserts the correct error.
  - All login, registration, and parallel user scenarios are now fully passing and resilient to UI interruptions. Credentials are always stored in `/tests/support/data.json` after registration for reliable login reuse.

- **ESLint setup and compliance:**
  - ESLint v9+ is configured with a flat config (`eslint.config.mjs`).
  - TypeScript and Playwright rules are enforced.
  - All code is linted and compliant with the rules (no unused variables, no unused catch params, no `any` types, etc).
  - To lint, run: `npx eslint . --ext .ts --max-warnings=0`
  - The legacy `eslint.config.js` is not needed; only `eslint.config.mjs` is required for ESLint v9+.

- **Registration Happy Path:**
  - Uses API registration only (bypasses UI and CAPTCHA for reliability).
  - UI message validation is removed; only API response is asserted.
  - RegistrationPage selectors are robust and up to date (see code for details).
- **Registration Negative Path:**
  - Attempts UI registration, but if CAPTCHA or overlays block, falls back to API registration to validate password errors. CAPTCHA iframe handling is robust and ignores errors if not clickable.
- **Parallel User Scenarios:**
  - Simulates two users in parallel: one filling the practice form (with robust modal/overlay handling and confirmation check), the other shuffling a sortable grid.
  - All steps are resilient to ad overlays, modals, and timing issues.
- **Selectors:**
  - All UI selectors for registration and login fields are based on the latest HTML attributes (see code for details).
- **Credentials Storage:**
  - Registered credentials are saved to `/tests/support/data.json` for reuse in login or other scenarios.
- **Error Handling:**
  - If registration fails due to CAPTCHA, the test automatically switches to API registration.
  - Login error messages are detected robustly, supporting multiple selectors and waiting for error visibility.
- **Test Structure:**
  - All test steps and logic are in `/tests/steps/Registration.steps.ts` and `/tests/steps/Login.steps.ts`.
  - Page Object Model is used for UI actions, but registration happy path is API-only for reliability.

---



## 🧪 Test Scenarios

- **Registration Happy Path:**
  - Register with valid data (API only), expect "User Register Successfully." in API response.
- **Registration Negative Path:**
  - Register with invalid password, expect password validation error (UI or API fallback if CAPTCHA or overlays block UI).
- **Login Happy Path:**
  - Login with valid stored credentials, expect successful login (profile page or logout button visible).
- **Login Negative Path:**
  - Login with invalid credentials, expect error message (robust selector detection).
- **Parallel User Scenario:**
  - User 1 fills and submits the practice form (with overlays/modals hidden and robust confirmation modal check).
  - User 2 shuffles the sortable grid items and verifies the order changes.
  - Negative scenario: User 1 submits the form with an invalid email and expects a validation error (UI or API fallback).

## 🔐 Password Regex
```
^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})$
```

## 📁 Data Storage
- Generated credentials are saved in `/tests/support/data.json` for reuse in login scenarios.

## ⚙️ Tech Stack
- [Playwright](https://playwright.dev/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [TypeScript](https://www.typescriptlang.org/)
- [Faker](https://fakerjs.dev/)

---

> **Note:** If CAPTCHA blocks UI registration, use the API:
> 
> POST https://demoqa.com/Account/v1/User
> 
> Body:
> ```json
> { "userName": "string", "password": "string" }
> ```
> 
> Success: 201 Created
> Failure: 404 or 406
