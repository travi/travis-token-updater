Feature: Legacy Public Project

  @wip
  Scenario: successful update
    Given the repository is public
#    And the project is legacy
    When the token is set
    Then the token is updated on the legacy Travis instance
