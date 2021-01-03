import allure from '@wdio/allure-reporter'
import { expect } from 'chai'
import {wd} from "../../core/wdio/wdio";
import {BasePage} from "./basePage.page";

class Cart extends BasePage {

    /** Locators **/
    private productTitle(): WebdriverIO.Element {
        return $('.sc-list-item-content .sc-product-title');
    }

    private productTitleByText(text: string): WebdriverIO.Element {
        const selector = `//*[@class="sc-list-item-content"]//*[contains(@class,"sc-product-title") and normalize-space(text())='${text}']`
        return $(selector)
    }

    private shoppingCartDeleteItemButtons(): WebdriverIO.ElementArray {
        return $$('[value="Delete"]');
    }

    private shoppingCartDeleteItemButton(): WebdriverIO.Element {
        return $('[value="Delete"]');
    }

    /** Page Actions **/
    verifyProductTitleVisibility(title: string, state = true) {
        allure.startStep(`Verify product title ${title} visibility state to be ${state}`);
        expect(this.productTitleByText(title).isDisplayed(),
            `Incorrect product ${title} visibility state`).to.be.equal(state);
        allure.endStep();
        return this;
    }

    verifyItemsInCartVisibility(state = true) {
        allure.startStep(`Verity items in cart visibility state to be equal ${state}`)
        expect(this.productTitle().isDisplayed(),
            'Incorrect product titles visibility state').to.be.equal(state);
        allure.endStep();
        return this;
    }

    performDeletingEveryCartItemIfPresent() {
        allure.startStep('Perform deleting every cart item')
        if (wd.isElementVisible(this.shoppingCartDeleteItemButton())) {
            this.shoppingCartDeleteItemButtons().forEach(button => {
                button.click()
                wd.waitForDisplayed(button, true, 3000)
            })
        }
        allure.endStep();
        return this;
    }
}

export const cart = new Cart();