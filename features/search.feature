Feature: Help Centre article search
  As a visitor with a question
  I want to search the knowledge base
  So that I can find the most relevant article quickly

  Background:
    Given I am on the MrQ Help Centre home page

  @search
  Scenario Outline: Searching for a common term returns results
    When I search for "<query>"
    Then I see at least one matching article in the results

    Examples:
      | query        |
      | deposit      |
      | withdraw     |
      | verification |

  @search @negative
  Scenario: Searching for gibberish shows the no-results state
    When I search for "gibberishnonsense"
    Then I see a no-results state

  @bug @search
  Scenario: Clearing the search input resets the no-results state
    When I search for "gibberishnonsense"
    Then I see a no-results state
    When I clear the search input
    Then I no longer see the no-results message
