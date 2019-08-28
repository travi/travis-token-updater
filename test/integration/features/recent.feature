Feature: Recent Public Project

  @wip
  Scenario: successful update
    Given the repository is public
#    And the project is recent
    When the token is set
    Then the token is updated on the pro Travis instance
