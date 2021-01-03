import {wd} from "../../../core/wdio/wdio";
import allure from '@wdio/allure-reporter';
import { expect } from "chai";
import {cart} from "../cart.page";


export class Header {

    /** Locators **/

    private searchBarInput(): WebdriverIO.Element {
        return $('#twotabsearchtextbox');
    }

    private searchGoButton(): WebdriverIO.Element {
        return $('[value="Go"]');
    }

    private accountAndListsWrapper(): WebdriverIO.Element {
        return $('#nav-link-accountList');
    }

    private accountAndListsUserName(): WebdriverIO.Element {
        return $('#nav-link-accountList span.nav-line-1');
    }

    private itemCartCount(): WebdriverIO.Element {
        return $('#nav-cart-count')
    }

    private itemCartCountByNum(num: number): WebdriverIO.Element {
        const selector = `//*[@id="nav-cart-count" and text()="${num}"]`
        return $(selector)
    }

    private cartWrapper(): WebdriverIO.Element {
        return $('#nav-cart')
    }

    private newCustomerRegisterLink(): WebdriverIO.Element {
        return $('#nav-flyout-ya-newCust a');
    }


    /** Page Methods **/
    getAccountAndListsUserName(): string {
        allure.startStep(`Get user name from Account & Lists wrapper`)
        const userName = this.accountAndListsUserName().getText().match(/(?<=\s)\w+/g)[0];
        allure.endStep();
        return userName;
    }

    getItemCartCount(): number {
        return +this.itemCartCount().getText()
    }

    fillSearchBar(value: string) {
        allure.startStep(`Fill search bar with ${value} value`)
        this.searchBarInput().setValue(value);
        allure.endStep();
        return this;
    }

    clickSearchButton() {
        allure.startStep('Click oon Search button')
        this.searchGoButton().click();
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    getNewCustomerRegisterLink(): string {
        return this.newCustomerRegisterLink().getAttribute('href');
    }

    /** Note: methods like this acts as sort of asserion, by doing this not only you proceed to the next "When"
     but also verify that cart has the required number of elements */
    clickOnCartWithItemCartCount(itemCount: number) {
        allure.startStep(`Click on Cart with item cart count equals ${itemCount}`)
        this.itemCartCountByNum(itemCount).click();
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    clickOnCartWrapper() {
        allure.startStep(`Click on Cart wrapper`)
        this.cartWrapper().click();
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    clickAccountAndListsWrapper() {
        allure.startStep(`Click on Account & Lists wrapper`)
        this.accountAndListsWrapper().click();
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    waitForAccountAndListsContainUser(userName: string) {
        allure.startStep(`Wait for Account & Lists to contain user ${userName}`)
        wd.waitForTextPresent(this.accountAndListsUserName(), 'Hello, ' + userName);
        allure.endStep();
        return this;
    }

    /** Page actions **/
    performSearch(searchValue: string) {
        allure.startStep(`Perform search with ${searchValue} value`)
        this.fillSearchBar(searchValue);
        this.clickSearchButton();
        allure.endStep();
        return this;
    }

    verifyUserNameInAccountsAndLists(userName: string) {
        allure.startStep(`Verify username ${userName} value in Accounts & Lists`)
        expect(this.getAccountAndListsUserName(),
            'Incorrect username value in Accounts & Lists').to.be.equal(userName);
        allure.endStep();
        return this;
    }

    verifyItemCardCount(count: number) {
        allure.startStep(`Verify Item cart count to be ${count}`)
        expect(this.getItemCartCount(), 'Incorrect item cart count').to.equal(count);
        allure.endStep();
        return this;
    }
};

export const header = new Header();