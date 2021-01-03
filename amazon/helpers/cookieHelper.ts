import allure from "@wdio/allure-reporter";

export const loginCookies = {
    x_main: undefined,
    at_main: undefined,
};

export class CookieHelper {

    setLoginCookies() {
        allure.startStep(`Set browser login cookies`);
        browser.setCookies([
            { name: 'x-main', value: loginCookies.x_main[0].value },
            { name: 'at-main', value: loginCookies.at_main[0].value },
        ]);
        allure.endStep();
    }

    getLoginCookies() {
        allure.startStep(`Get browser login cookies`);
        loginCookies.x_main = browser.getCookies(['x-main']);
        loginCookies.at_main = browser.getCookies(['at-main']);
        allure.endStep();
    };
}