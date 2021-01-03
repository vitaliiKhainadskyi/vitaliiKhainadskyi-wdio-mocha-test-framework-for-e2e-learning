import {homePage} from "../../pages/homePage/homePage.page";
import * as faker from 'faker'
import {BasePage} from "../../pages/basePage.page";
import {loginPage} from "../../pages/login.page";

const currentUser = BasePage.getUser();

describe('Register users tests', () => {
    it('User should be able to register new participant', () => {
        // Test Data
        const newUser = {
            name: currentUser.name + '_' + faker.random.alphaNumeric(5),
            email: `amazontestuserwdio+${faker.random.alphaNumeric(5)}@gmail.com`,
            password: currentUser.password

        }
        homePage.navigateToRegistrationForm();
        /*
        ** Not Possible due to capcha... **
            Yet the process is simple:
             - Register using random data to the same email
             - Get the link via GMAIL API
             - Navigate to the link
         */
    })
})