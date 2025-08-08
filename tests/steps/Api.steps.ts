import { When, Then, Given, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

setDefaultTimeout(60 * 1000);

const BASE_URL = 'https://demoqa.com';

Given('I have valid user credentials', function (this: CustomWorld) {
  this.apiUser = {
    userName: 'testuser_' + Date.now(),
    password: 'Password1!'
  };
});

When('I request all books from the API', async function (this: CustomWorld) {
  const response = await this.apiRequestContext!.get(`${BASE_URL}/BookStore/v1/Books`);
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
});

Then('the response should have status 200', function (this: CustomWorld) {
  expect(this.apiResponse!.status()).toBe(200);
});

Then('the response should contain a list of books', function (this: CustomWorld) {
  const body = this.apiResponseBody as { books: unknown[] };
  expect(Array.isArray(body.books)).toBe(true);
});

When('I request a token from the API', async function (this: CustomWorld) {
  if (!this.apiUser) {
    // Ensure apiUser is set for this scenario
    this.apiUser = {
      userName: 'testuser_' + Date.now(),
      password: 'Password1!'
    };
  }
  // Register user before generating token
  const regResponse = await this.apiRequestContext!.post(`${BASE_URL}/Account/v1/User`, {
    data: this.apiUser,
    headers: { 'Content-Type': 'application/json' }
  });
  const regBody = await regResponse.json();
  this.apiUserId = regBody.userID || regBody.userId || regBody.id;
  const response = await this.apiRequestContext!.post(`${BASE_URL}/Account/v1/GenerateToken`, {
    data: this.apiUser,
    headers: { 'Content-Type': 'application/json' }
  });
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  // Only set token if present and is a string
  const body = this.apiResponseBody as { token?: string };
  this.apiToken = typeof body.token === 'string' ? body.token : undefined;
});

Then('the response should contain a token', function (this: CustomWorld) {
  expect(typeof this.apiToken).toBe('string');
  expect(this.apiToken && this.apiToken.length).toBeGreaterThan(10);
});

Given('I have a valid user token', async function (this: CustomWorld) {
  if (!this.apiUser) {
    this.apiUser = {
      userName: 'testuser_' + Date.now(),
      password: 'Password1!'
    };
  }
  // Register user (ignore if already exists)
  const regResponse = await this.apiRequestContext!.post(`${BASE_URL}/Account/v1/User`, {
    data: this.apiUser,
    headers: { 'Content-Type': 'application/json' }
  });
  const regBody = await regResponse.json();
  this.apiUserId = regBody.userID || regBody.userId || regBody.id;
  // Generate token
  const response = await this.apiRequestContext!.post(`${BASE_URL}/Account/v1/GenerateToken`, {
    data: this.apiUser,
    headers: { 'Content-Type': 'application/json' }
  });
  const body = await response.json();
  this.apiToken = typeof body.token === 'string' ? body.token : undefined;
});

When('I request my user account details', async function (this: CustomWorld) {
  // Use userId if available, otherwise fallback to userName
  const userId = this.apiUserId || this.apiUser!.userName;
  const response = await this.apiRequestContext!.get(`${BASE_URL}/Account/v1/User/${userId}`, {
    headers: { Authorization: `Bearer ${this.apiToken!}` }
  });
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
});

Then('the response should contain my user information', function (this: CustomWorld) {
  const body = this.apiResponseBody as { username?: string; userName?: string };
  expect(body.username || body.userName).toBe(this.apiUser!.userName);
});
