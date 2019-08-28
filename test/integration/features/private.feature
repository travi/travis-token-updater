Feature: Private Project

  @wip
  Scenario: successful update
    Given the repository is private
    When the token is set
    Then the token is updated on the pro Travis instance
