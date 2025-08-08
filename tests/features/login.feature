@ui
Feature: Login
  As a registered user
  I want to log in to the application
  So that I can access my profile

  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I fill in the login form with valid stored credentials
    Then I should see my profile page

  Scenario: Login fails with invalid credentials
    Given I navigate to the login page
    When I fill in the login form with invalid credentials
    Then I should see a login error message
