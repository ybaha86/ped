@ID

Feature: Tokopedia Purchase Random Item

  Scenario: Login and Purchase
    * User Login with credential "" "" ""
    * Search Product "Fossil"
    * Short search result based on "5"
    * select item by index "4"
    * Purchase selected item
