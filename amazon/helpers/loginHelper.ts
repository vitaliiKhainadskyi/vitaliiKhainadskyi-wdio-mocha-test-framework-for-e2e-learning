import {BasePage} from "../pages/basePage.page";
import {homePage} from "../pages/homePage/homePage.page";
import {loginPage} from "../pages/login.page";
import {CookieHelper, loginCookies} from "./cookieHelper";
import {wd} from "../../core/wdio/wdio";
import {header} from "../pages/commonDrawers/header.page";
import moment = require("moment");


class LoginHelper {

    cookieHelper: CookieHelper;

    constructor() {
        this.cookieHelper = new CookieHelper();
    }

    public performLoginAction(cookieLogin = true) {
        const { name, email, password} = BasePage.getUser();
        const loginTryDate = moment().format('MMM DD, YYYY hh:mm A');
        if (!loginCookies.x_main || !cookieLogin) {
            try {
                homePage
                    .header.clickAccountAndListsWrapper()
                loginPage
                    .performLogIn({email, password})
                header.waitForAccountAndListsContainUser(name);
                this.cookieHelper.getLoginCookies();
            } catch {
                if (homePage.getTextElement('To continue, approve the notification sent to:').isDisplayed()) {
                    wd.navigateToPage(loginPage.getEmailSignInAttemptLink(loginTryDate));
                    loginPage.performApprovingSignIn();
                    header.waitForAccountAndListsContainUser(name);
                    this.cookieHelper.getLoginCookies();
                } else {
                    browser.refresh();
                    wd.waitForPageToLoad();
                    homePage
                      .header.clickAccountAndListsWrapper()
                    loginPage
                      .performLogIn({email, password})
                    header.waitForAccountAndListsContainUser(name);
                    this.cookieHelper.getLoginCookies();
                }
            }
        } else {
            this.cookieHelper.setLoginCookies();
            browser.refresh();
            wd.waitForPageToLoad();
            header.waitForAccountAndListsContainUser(name);
        }
    }
}

export const loginHelper = new LoginHelper();