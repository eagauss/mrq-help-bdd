Feature: Help Centre homepage
  As a visitor to the MrQ Help Centre
  I want the homepage to expose the key entry points
  So that I can search, browse categories, or return to the main site

  Background:
    Given I am on the MrQ Help Centre home page

  @smoke
  Scenario: Homepage renders core help-centre elements
    Then I see the article search input
    And I see the "Back to MrQ.com" link in the header
    And I see all expected help categories

  @smoke
  Scenario: Back to MrQ.com link points to the main site
    Then the "Back to MrQ.com" link points to the main MrQ site
