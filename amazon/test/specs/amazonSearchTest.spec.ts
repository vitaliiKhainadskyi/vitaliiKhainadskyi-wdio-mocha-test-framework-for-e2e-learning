import {homePage} from "../../pages/homePage/homePage.page";
import {header} from "../../pages/commonDrawers/header.page";
import {searchPage} from "../../pages/searchPage/searchPage.page";
import {BasePage} from "../../pages/basePage.page";


describe('Amazon search tests' , () => {

    it('User should be able to search product item via item name and brand filter' , () => {

        // Test data
        const searchQuery = 'iPhone';

        // When
        homePage
            .header.performSearch(searchQuery)
        searchPage
            .clickOnBrandFilter('Apple')

        // Then
            .verifySearchResultsContainsQuery(searchQuery)
    })

    it('User should not be able to search product item with incorrect title' , () => {
        // Test data
        const searchQuery = 'qwreqwerdfgxzcvqertcvb';

        // When
        homePage
            .header.performSearch(searchQuery)

        // Then
        searchPage
            .verifySearchResultsNotContainsQuery(searchQuery)
    })

    it('[C3] User should be able to check filters after search' , () => {
        // Test data
        const testData = BasePage.getTestDataFromFile('C3');

        // When
        homePage
          .header.performSearch(testData.searchQuery)
        searchPage
          .checkSeveralFiltersBySections(testData.filters)

        // Then
        searchPage
          .verifyFiltersBySectionsCheckedStatus(testData.filters)
    })
})