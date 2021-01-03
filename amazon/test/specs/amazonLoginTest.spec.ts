import {BasePage} from "../../pages/basePage.page";
import {homePage} from "../../pages/homePage/homePage.page";
import {loginPage} from "../../pages/login.page";


describe(`Amazon Log in tests`, () => {

    // Test Data
    const { name, email, password } = BasePage.getUser();

    it('User should be able to log in', () => {

        // When
        homePage
            .header.clickAccountAndListsWrapper()
        loginPage
            .performLogIn({ email, password })
        // Then
            .header.verifyUserNameInAccountsAndLists(name);
    })
})