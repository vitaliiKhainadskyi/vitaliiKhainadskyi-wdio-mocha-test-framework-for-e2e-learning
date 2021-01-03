import {homePage} from "../../pages/homePage/homePage.page";
import {searchPage} from "../../pages/searchPage/searchPage.page";
import {header} from "../../pages/commonDrawers/header.page";
import {loginHelper} from "../../helpers/loginHelper";
import {cart} from "../../pages/cart.page";


describe(`Amazon adding items to Cart tests`, () => {

    function background() {
        loginHelper.performLoginAction();
        header.clickOnCartWrapper()
        cart
            .performDeletingEveryCartItemIfPresent();
    }

    it('User should be able to see empty cart if no items added ', () => {
        // Test Data
        const noItemsText = 'Your Amazon Cart is empty.'

        // Given
        background();

        // When
        homePage
            .header.clickOnCartWrapper()

         // Then
         cart
            .verifyItemsInCartVisibility(false)
            .verifyTextIsVisible(noItemsText)
            .header.verifyItemCardCount(0)

    })

    it('User should be able to add item to Cart via search feature', () => {
        // Test Data
        const searchQuery = 'Lenovo';
        let firstSearchResult = null;

        // Given
        background();

        // When
        homePage
            .header.performSearch(searchQuery)
        firstSearchResult = searchPage
            .getFirstSearchResultHeaderText()
        searchPage
            .clickOnFirstSearchResultItem()
            .clickAddToCart()
            .clickCloseButton()
            header.clickOnCartWithItemCartCount(1)
            header.clickOnCartWrapper()

        // Then
        cart
            .verifyProductTitleVisibility(firstSearchResult);
    })
})