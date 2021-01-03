import allure from '@wdio/allure-reporter';
import {wd} from "../../core/wdio/wdio";
import {homePage} from "./homePage/homePage.page";
import {BasePage} from "./basePage.page";

class LoginPage extends BasePage {

    /** Locators **/
    private emailInput(): WebdriverIO.Element {
        return $('#ap_email');
    }

    private continueButton(): WebdriverIO.Element {
        return $('#continue');
    }

    private passwordField(): WebdriverIO.Element {
        return $('#ap_password');
    }

    private mobilePhoneNotNowLink(): WebdriverIO.Element {
        return $(() => `//*[normalize-space(text())="Not now"]`);
    }

    private approveSignInAttemptButton(): WebdriverIO.Element {
        return $('.a-button-inner [value="Approved"]')
    }

    /** Page methods **/
    fillEmail(email: string) {
        allure.startStep(`Fill email field withj ${email} value`);
        this.emailInput().setValue(email);
        allure.endStep();
    }

    clickContinueButton() {
        allure.startStep(`Click Continue button`);
        this.continueButton().click();
        wd.waitForPageToLoad();
        allure.endStep();
    }

    clickApproveSignInButton() {
        allure.startStep(`Click Approve sign-in button`)
        this.approveSignInAttemptButton().click();
        allure.endStep();
    }

    fillPasswordField(password: string) {
        allure.startStep(`Fill password field with ${password} value`)
        this.passwordField().setValue(password);
        allure.endStep();
    }

    /** Page Actions **/
    performLogIn(user: { email: string, password: string, mobile?: number}) {
        allure.startStep(`Perfrom log in user with following data: ${JSON.stringify(user)}`)
        this.fillEmail(user.email);
        this.clickContinueButton();
        this.fillPasswordField(user.password);
        wd.pressEnter();
        wd.waitForPageToLoad();
        if (!user.mobile && this.mobilePhoneNotNowLink().isDisplayed()) {
            this.mobilePhoneNotNowLink().click();
            wd.waitForPageToLoad();
        } else {
            // TODO add logic for mobile phone
        }
        allure.endStep();
        return homePage;
    }

    performApprovingSignIn() {
        allure.startStep(`Perform apporving Sign-in`)
        this.clickApproveSignInButton();
        // wd.waitForDisplayed(this.getTextElement('Thank you. Sign-in attempt was approved.'));
        // this.navigateToPageInCurrentEnv('')
        wd.waitForPageToLoad()
        allure.endStep()
    }

    getEmailSignInAttemptLink(phraseInMessageBody: string, userEmail?: string) {
        allure.startStep(`Get Email sign-in attmept link for email ${userEmail} with phrase in message ${phraseInMessageBody}`);
        const messageBody = this.getMessageByExactPhraseInMessageBody(phraseInMessageBody);
        const siginInLinkLine = messageBody.match(/following link and paste it into a browser to view. ([^_])+/g)[0]
        let signInLinkWithCharacter = siginInLinkLine.match(/https:\/\/(.*)+/g)[0].replace(/(\--)+/g, '')
        const partToUpdate = signInLinkWithCharacter.match(/[^=]+(.\s)+/g)[0];
        signInLinkWithCharacter = signInLinkWithCharacter.replace(partToUpdate.substr(0, 2), '')
        signInLinkWithCharacter = signInLinkWithCharacter.replace(partToUpdate.substr(partToUpdate.indexOf('=')), '')
        const signInLink = signInLinkWithCharacter.substr(0, signInLinkWithCharacter.length - 1).replace(/\s/g, '')
        allure.endStep();
        console.log(signInLink);
        return signInLink;
    }
}

export const loginPage = new LoginPage();