import {BasePage} from "../basePage.page";
import {wd} from "../../../core/wdio/wdio";
import { expect } from "chai";
import allure from '@wdio/allure-reporter';
import {itemPage} from "../itemPage/itemPage.page";

class SearchPage extends BasePage {

    /** Locators **/

    private searchResultsHeaders(): WebdriverIO.ElementArray {
        return $$('[cel_widget_id*="MAIN-SEARCH_RESULTS"] h2 a');
    }

    private firstSearchResultHeader(): WebdriverIO.Element {
        return $('[cel_widget_id*="MAIN-SEARCH_RESULTS"] h2 a');
    }

    private brandFilterCheckbox(brand: string): WebdriverIO.Element {
        return $(`#brandsRefinements [aria-label="${brand}"] [class*="a-icon-checkbox"]`)
    }

    private filterCheckboxBySectionAndValueInput(section: string, filterValue: string) {
        return $('' + `//*[@class="a-section a-spacing-small"]//*[text()="${section}"]/../following-sibling::ul[1]//*[text()="${filterValue}"]/..//input[@type="checkbox"]`)
    }

    private filterCheckboxBySectionAndValueIcon(section: string, filterValue: string) {
        return $('' + `//*[@class="a-section a-spacing-small"]//*[text()="${section}"]/../following-sibling::ul[1]//*[text()="${filterValue}"]/..//i`)
    }


    /** Page methods **/
    clickOnBrandFilter(brand: string) {
        allure.startStep(`Click on brand filter: ${brand}`)
        this.brandFilterCheckbox(brand).click();
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    clickCheckboxFilterBySectionAndValue(section: string, value: string) {
        allure.startStep(`Click on checkbox section ${section} filter ${value}`)
        this.filterCheckboxBySectionAndValueIcon(section, value).click();
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    getFirstSearchResultHeaderText(): string {
        allure.startStep(`Get first search result header text`)
        const headerText = this.firstSearchResultHeader().getText();
        allure.endStep();
        return headerText;
    }

    clickOnFirstSearchResultItem() {
        allure.startStep(`CLick on first search result item`)
        this.firstSearchResultHeader().click();
        wd.waitForPageToLoad();
        allure.endStep();
        return itemPage;
    }

    getFilterBySectionCheckedStatus(section: string, value: string): boolean {
        // Note! very easy to use ! operators to make boolean expression
        return !!this.filterCheckboxBySectionAndValueInput(section, value).getAttribute('checked');
    }

    /** Page actions **/
    verifySearchResultsContainsQuery(query: string) {
        allure.startStep(`Verify search results contains query ${query}`)
        this.searchResultsHeaders().forEach(item => {
            expect(item.getText(), `Item doesn't match search query`).to.include(query);
        })
        allure.endStep();
        return this;
    }

    checkSeveralFiltersBySections(filters: any) {
        allure.startStep(`Check several filters with the following data: ${JSON.stringify(filters)}`)
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                value.forEach(entry => this.clickCheckboxFilterBySectionAndValue(key, entry));
            } else {
                // @ts-ignore
                this.clickCheckboxFilterBySectionAndValue(key, value);
            }
        })
        allure.endStep();
        return this;
    }

    verifySearchResultsNotContainsQuery(query: string) {
        allure.startStep(`Verify search results doesn't contain search query ${query}`)
        this.searchResultsHeaders().forEach(item => {
            expect(item.getText(), `Item should not match search query`).not.to.include(query);
        })
        allure.endStep();
        return this;
    }

    verifyFiltersBySectionsCheckedStatus(filters: any, status = true) {
        allure.startStep(`Verify filters ${JSON.stringify(filters)} to have checked status ${status}`)
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                value.forEach(entry => expect(this.getFilterBySectionCheckedStatus(key, entry)));
            } else {
                // @ts-ignore
                expect(this.getFilterBySectionCheckedStatus(key, value),
                  `Incorrect filter by section ${key} filter ${value} checked status`).to.be.equal(status);
            }
        })
        allure.endStep();
        return this;
    }
}

export const searchPage = new SearchPage();