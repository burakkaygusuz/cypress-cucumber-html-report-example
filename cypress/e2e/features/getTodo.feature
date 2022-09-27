Feature: GET Todos

    Scenario: Get Todo
        Given send request to getting todo with id 1
        Then user id should be 1
        And title should be delectus aut autem