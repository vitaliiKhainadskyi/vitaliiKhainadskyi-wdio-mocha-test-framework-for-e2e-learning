import {BasePage} from "../basePage.page";
import allure from '@wdio/allure-reporter';
import {wd} from "../../../core/wdio/wdio";
import {registerPage} from '../register.page';
class HomePage extends BasePage {

    /** Locators **/

    /** Page methods **/

    /** Page actions **/
    navigateToRegistrationForm() {
        allure.startStep('Navigate to registration from via header "New Customer" link');
        wd.navigateToPage(this.header.getNewCustomerRegisterLink());
        wd.waitForPageTitle('Amazon Registration');
        allure.endStep();
        return registerPage;
    }
}

export const homePage = new HomePage();