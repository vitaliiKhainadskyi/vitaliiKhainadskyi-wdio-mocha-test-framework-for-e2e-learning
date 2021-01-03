

class Wdio {

    public get defaultWaitTime(): number {
        return 10000;
    }

    public waitForPageToLoad(timeout = this.defaultWaitTime) {
        browser.waitUntil(() => {
                return browser.execute(`return document.readyState === 'complete'`);
            },        {
            timeout,
            timeoutMsg: `expect page to load in ${timeout} time`
        })
    }

    public wait(seconds: number) {
        browser.pause(seconds * 1000);
    }

    public pressEnter() {
        browser.keys('Enter');
    }

    public pressKeys(value: string) {
        browser.keys(value);
    }

    waitForTextPresent(element: WebdriverIO.Element, text: string, timeout = 5000) {
        browser.waitUntil(() => element.getText() === text, {timeout});
    }

    waitForDisplayed(element: WebdriverIO.Element, reverse = false, timeout = this.defaultWaitTime) {
        browser.waitUntil(
            function () {
                const condition = element.isDisplayed();
                if (typeof condition === 'object') {
                    if (!Object.values(condition)[0]) {
                        throw new Error(
                            `type of ${element} is ${typeof condition}. element condition should be boolean but got - ${condition}. Failed on waitForDisplayed method. IE specific error`,
                        );
                    }
                    // @ts-ignore
                    return browser.isElementDisplayed(Object.values(condition)[0]);
                }
                return condition === !reverse;
            },
            {
                timeout,
                timeoutMsg: `${element} - still${!reverse ? ' not' : ''} displayed after ${timeout}ms`,
            },
        );
    }

    isElementVisible(element: WebdriverIO.Element, timeout = this.defaultWaitTime): boolean {
        try {
            element.waitForExist({timeout})
            element.waitForDisplayed({timeout})
        } catch (error) {

        }
        return element.isDisplayed();
    }

    public navigateToPage(url: string) {
        browser.url(url);
        wd.waitForPageToLoad();
    }

    public waitForPageTitle(title: string, timeout = this.defaultWaitTime) {
        browser.waitUntil(() => browser.getTitle().includes(title), { timeout })
    }
}

export const wd = new Wdio();