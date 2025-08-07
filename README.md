# Playwright + Cucumber + TypeScript E2E Demo (Registration & Login)

Automated end-to-end tests for [demoqa.com/register](https://demoqa.com/register) and [demoqa.com/login](https://demoqa.com/login) using Playwright, Cucumber (Gherkin), TypeScript, and the Page Object Model (POM) pattern.

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
- Automate both registration and login flows (UI or API fallback if CAPTCHA blocks UI registration)
- Validate both successful and failed registrations (password regex) and logins (valid/invalid credentials)
- Store credentials for login reuse
- Use POM and Cucumber for maintainable, readable tests
- Ensure robust error message detection and credential handling for both flows

---




## 🛠️ Implementation & Changes

- **Playwright browser installation required:**
  - After `npm install`, run `npx playwright install` to download browser binaries.

- **Registration & Login E2E Features:**
  - Feature files: `tests/features/registration.feature` and `tests/features/login.feature` cover both registration and login flows, each with happy and negative scenarios.
  - Page Objects: `tests/pages/RegistrationPage.ts` and `tests/pages/LoginPage.ts` encapsulate UI actions and selectors for each flow.
  - Step Definitions: `tests/steps/Registration.steps.ts` and `tests/steps/Login.steps.ts` implement all steps, including credential reuse and robust error message detection.
  - Credentials are read from `tests/support/data.json` and support both `userName` and `username` keys for compatibility.
  - Error message detection is robust, supporting multiple selectors and waiting for error visibility.
  - All login and registration scenarios are now fully passing.

- **ESLint setup and compliance:**
  - ESLint v9+ is configured with a flat config (`eslint.config.mjs`).
  - TypeScript and Playwright rules are enforced.
  - All code is linted and compliant with the rules (no unused variables, no unused catch params, no `any` types, etc).
  - To lint, run: `npx eslint . --ext .ts --max-warnings=0`

- **Registration Happy Path:**
  - Now uses API registration only (bypasses UI and CAPTCHA).
  - UI message validation is removed; only API response is asserted.
- **Registration Negative Path:**
  - Attempts UI registration, but if CAPTCHA blocks, falls back to API registration to validate password errors.
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
  - Register with invalid password, expect password validation error (UI or API fallback).
- **Login Happy Path:**
  - Login with valid stored credentials, expect successful login (profile page or logout button visible).
- **Login Negative Path:**
  - Login with invalid credentials, expect error message (robust selector detection).

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
