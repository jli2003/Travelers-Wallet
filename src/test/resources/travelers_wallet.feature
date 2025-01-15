Feature: Travelers Wallet

  Scenario: Currency Conversion
    Given a list of currencies
    When I request a conversion of 100 from USD to EUR
    Then I get 93 EUR back

  Scenario: Setting Budget
    Given a budget of 0
    When I update the budget to 1000 USD
    Then budget will update to 1000 USD

  Scenario: Adding Expense
    Given a budget of 100 USD
    When I add an expense of type food and cost 10
    Then budget will update to 90
