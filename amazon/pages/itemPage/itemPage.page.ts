import allure from '@wdio/allure-reporter'
import {wd} from "../../../core/wdio/wdio";
import {BasePage} from "../basePage.page";

class ItemPage extends BasePage {
    /** Locators **/
    private addToCartButton(): WebdriverIO.Element {
        return $('#add-to-cart-button');
    }

    /** Page Methods **/
    clickAddToCart() {
        allure.startStep('Click on add to cart button')
        this.addToCartButton().click();
        wd.waitForPageToLoad()
        allure.endStep();
        return this;
    }
}

export const itemPage = new ItemPage();