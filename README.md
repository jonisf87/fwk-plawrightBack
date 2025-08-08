# Playwright + Cucumber + TypeScript E2E Demo (Registration, Login & Parallel User Simulation)


Automated end-to-end and API tests for [demoqa.com/register](https://demoqa.com/register), [demoqa.com/login](https://demoqa.com/login), [demoqa.com/automation-practice-form](https://demoqa.com/automation-practice-form), and [demoqa.com/swagger/](https://demoqa.com/swagger/) using Playwright, Cucumber (Gherkin), TypeScript, and the Page Object Model (POM) pattern.

This suite covers all major flows:

- User registration (happy/negative paths, robust CAPTCHA/API fallback)
- User login (happy/negative paths)
- Parallel User Simulation: two users in parallel, one filling the practice form (with overlays/modals/CAPTCHA handling), the other shuffling the sortable grid
- **API Testing:**
  - Retrieve all books from the Bookstore API
  - Generate a user token via the authentication endpoint
  - Use the generated token to call authenticated API methods (e.g., get user account details)
  - Validate HTTP status codes and response structure using TypeScript assertions
  - All API tests are integrated into the Cucumber BDD framework

The "Parallel User Simulation" scenario is a core part of this suite, demonstrating robust multi-user E2E automation and resilience to UI interruptions. See the relevant feature and step files for details.

**Sample Image:**
A sample image for upload is provided at `tests/fixtures/test-image.png`. You can replace it with any PNG/JPG file for testing.

## 📦 Folder Structure

```
/tests
  ├── /features        # Gherkin `.feature` files (UI and API scenarios)
  ├── /steps           # Cucumber step definitions (UI and API)
  ├── /pages           # Page Object Model classes (TypeScript, for UI flows)
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


5. **Run E2E and API Tests:**
   ```sh
   npm test
   ```

6. **View HTML Reports:**
   After running tests, HTML reports are generated in the `reports/` directory:
   - `reports/ui-chromium-report.html` (UI tests on Chromium)
   - `reports/ui-firefox-report.html` (UI tests on Firefox)
   - `reports/api-report.html` (API tests)
   Open these files in your browser to view detailed test results.

6. **Generate Playwright code (optional):**
   ```sh
   npm run codegen
   ```



## 📝 Project Goals & Implementation Notes
- Automate registration, login, parallel user flows, and API scenarios (UI or API fallback if CAPTCHA or overlays block UI)
- Validate both successful and failed registrations (password regex), logins (valid/invalid credentials), and API responses (status codes, structure)
- Store credentials for login reuse and API tokens for authenticated API calls
- Use POM and Cucumber for maintainable, readable, and robust tests
- Ensure robust error message detection, credential handling, modal/overlay resilience, and API assertion for all flows

---





## 🛠️ Implementation & Changes

- **Playwright browser installation required:**
  - After `npm install`, run `npx playwright install` to download browser binaries.


- **Registration, Login, Parallel User & API E2E Features:**
  - Feature files: `tests/features/registration.feature`, `tests/features/login.feature`, `tests/features/parallelUsers.feature`, and `tests/features/api.feature` cover registration, login, parallel user, and API flows, each with happy and negative scenarios.
  - Page Objects: `tests/pages/RegistrationPage.ts`, `tests/pages/LoginPage.ts`, `tests/pages/PracticeFormPage.ts`, and `tests/pages/SortablePage.ts` encapsulate UI actions and selectors for each UI flow. API tests do not use POM.
  - Step Definitions: `tests/steps/Registration.steps.ts`, `tests/steps/Login.steps.ts`, `tests/steps/ParallelUsers.steps.ts`, and `tests/steps/Api.steps.ts` implement all steps, including credential reuse, robust error/modal detection, API fallback, and API assertions. All code is now fully ESLint-compliant (no unused variables, no `any` types, no unused catch params).
  - Credentials are read from `tests/support/data.json` and support both `userName` and `username` keys for compatibility. API tokens and userIds are managed in the Cucumber world state.
  - Error/modal detection is robust, supporting multiple selectors, retries, and fallback to API if UI is blocked by CAPTCHA or overlays. CAPTCHA handling in registration is fully automated: if UI registration is blocked, the test falls back to API registration and asserts the correct error.

  - All login, registration, parallel user, and API scenarios are now fully passing and resilient to UI interruptions. Credentials are always stored in `/tests/support/data.json` after registration for reliable login reuse.
  - **HTML Reports:** All test runs generate HTML reports in the `reports/` directory for both UI and API tests. These are also uploaded as artifacts in CI.

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
  - **CI/CD Integration:** See the new section below for details on automated linting, test execution, and report upload.

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
- **API Scenarios:**
  - Retrieve all books from the Bookstore API, expect status 200 and a list of books
  - Generate a user token via the authentication endpoint, expect status 200 and a valid token
  - Use the generated token to call an authenticated API method (get user account details), expect status 200 and correct user info

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

---

## 🤖 CI/CD: GitHub Actions Workflow

This project includes a robust GitHub Actions workflow for continuous integration:

- **Lint Job:** Runs ESLint on all TypeScript files to enforce code quality.
- **UI Tests Job:** Runs all UI scenarios on both Chromium and Firefox using a matrix strategy. Each browser run generates an HTML report (`reports/ui-chromium-report.html`, `reports/ui-firefox-report.html`).
- **API Tests Job:** Runs all API scenarios (tagged with `@api`) and generates an HTML report (`reports/api-report.html`).
- **Artifact Upload:** All HTML reports are uploaded as workflow artifacts for download and review.

### Workflow File
See `.github/workflows/playwright.yml` for the full configuration.

### How It Works
- On every push or manual trigger, the workflow will:
  1. Lint the codebase with ESLint.
  2. Run UI tests on Chromium and Firefox in parallel, generating and uploading HTML reports.
  3. Run API tests, generating and uploading an HTML report.

You can download the reports from the GitHub Actions run summary after each workflow execution.

---
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
