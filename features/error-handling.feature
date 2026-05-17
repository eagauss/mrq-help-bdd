Feature: Help Centre error handling
  As a visitor who hits a stale link or mistypes an article URL
  I want the help centre to tell me clearly that the page is gone
  So that I can search for what I needed instead of seeing a blank page

  @smoke @error
  Scenario: A non-existent article URL shows a not-found state
    When I open a non-existent article URL
    Then I see a not-found message
    And the search input is still available
