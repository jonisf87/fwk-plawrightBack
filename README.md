# Playwright + Cucumber + TypeScript E2E Demo (POM)

Automated end-to-end tests for [demoqa.com/register](https://demoqa.com/register) using Playwright, Cucumber (Gherkin), TypeScript, and the Page Object Model (POM) pattern.

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

5. **Generate Playwright code (optional):**
   ```sh
   npm run codegen
   ```


## 📝 Project Goals & Implementation Notes
- Automate registration (UI or API fallback if CAPTCHA blocks UI)
- Validate both successful and failed registrations (password regex)
- Store credentials for login reuse
- Use POM and Cucumber for maintainable, readable tests

---


## 🛠️ Implementation & Changes

- **Playwright browser installation required:**
  - After `npm install`, run `npx playwright install` to download browser binaries.
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
  - All UI selectors for registration fields are based on the latest HTML attributes (see code for details).
- **Credentials Storage:**
  - Registered credentials are saved to `/tests/support/data.json` for reuse in login or other scenarios.
- **Error Handling:**
  - If registration fails due to CAPTCHA, the test automatically switches to API registration.
- **Test Structure:**
  - All test steps and logic are in `/tests/steps/Registration.steps.ts`.
  - Page Object Model is used for UI actions, but happy path is API-only for reliability.

---


## 🧪 Test Scenarios
- **Happy path:** Register with valid data (API only), expect "User Register Successfully." in API response.
- **Negative path:** Register with invalid password, expect password validation error (UI or API fallback).

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
