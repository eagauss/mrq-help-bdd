Feature: Help Centre category browsing
  As a visitor without a specific search term
  I want to browse help categories
  So that I can discover articles by topic

  Background:
    Given I am on the MrQ Help Centre home page

  @navigation
  Scenario: Opening a category, reading an article, and returning to the category list
    When I open the "Deposits & Withdrawals" category
    Then I see a list of articles in the category
    When I open the first article in the category
    Then I see the article page with a non-empty title and body
    When I navigate back
    Then I see a list of articles in the category

  @navigation
  Scenario Outline: Each category lists at least one article
    When I open the "<category>" category
    Then I see a list of articles in the category
    Examples:
      | category               |
      | Getting Started        |
      | Your Account           |
      | Verification           |
      | Deposits & Withdrawals |
      | Promotions             |
      | Safer Gambling         |
      | Games & How They Work  |
      | Technical Help         |
      | Getting in touch       |

  @navigation @contact
  Scenario: Getting in touch category exposes a contact path
    When I open the "Getting in touch" category
    Then I see a list of articles in the category
    When I open the first article in the category
    Then I see the article page with a non-empty title and body
    And I see a way to contact MrQ
