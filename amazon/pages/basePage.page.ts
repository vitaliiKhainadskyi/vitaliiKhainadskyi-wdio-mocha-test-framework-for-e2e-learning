import {Header} from "./commonDrawers/header.page"
import * as fs from "fs";
import * as path from "path";
import allure from '@wdio/allure-reporter'
import {wd} from "../../core/wdio/wdio";
import { expect } from 'chai'
import {gmailAPI} from "../../api/gmailAPI";
const parseTextContent = require('parse-html-text-content');


export class BasePage {
    header: Header

    constructor() {
        this.header = new Header();
    }

    /** Locators **/
    private closeButton(): WebdriverIO.Element {
        return $('.close-button')
    }

    private textElementNoSpaces(text: string): WebdriverIO.Element {
        return $('' + `//*[normalize-space(text())="${text}"]`);
    }

    private textElement(text: string): WebdriverIO.Element {
        return $('' + `//*[text()="${text}"]`);
    }

    /** Page Methods **/
    clickCloseButton() {
        allure.startStep(`Click on Close button`)
        this.closeButton().click();
        wd.waitForDisplayed(this.closeButton(), true, 3000);
        allure.endStep();
        return this;
    }

    static getUser() {
        return JSON.parse(fs.readFileSync(path.join(process.env.RESOURCES_DIR,'users.json'), 'utf-8')).users.test;
    }

    static getTestDataFromFile(testCaseId: string) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../test/testData/', 'testData.json'), 'utf-8'))[testCaseId]
    }

    getTextElement(text: string, noSpaces = true) {
        return noSpaces ? this.textElementNoSpaces(text) : this.textElement(text);
    }

    /** Page Actions **/
    verifyTextIsVisible(text: string, state = true, noSpaces = true) {
        allure.startStep(`Verify text ${text} visibility state to be ${state}`)
        expect(wd.isElementVisible(noSpaces ? this.textElementNoSpaces(text) : this.textElement(text), 3000),
            `Incorrect element with text ${text} visibility state`).to.be.equal(state);
        allure.endStep();
        return this;
    }

    navigateToPageInCurrentEnv(url: string) {
        allure.startStep(`Open ${url} page`);
        wd.navigateToPage(`${process.env.BASE_URL}${url}`);
        wd.waitForPageToLoad();
        allure.endStep();
        return this;
    }

    // GMAIL
    getMessageBySubject(
        subject: string,
        parseHtml = true,
        email = 'amazontestuserwdio@gmail.com',
        format: 'raw' | 'full' = 'raw',
    ) {
        return browser.call(async () => {
            const data = await gmailAPI.filterEmails(`to:${email} subject:${subject}`);
            let messageId = null;
            await Promise.all(data.messages.map(async message => {
                const emailData = await gmailAPI.getEmailById(message.id, 'raw');
                const regex = new RegExp(`Subject: ${subject}`)
                if (emailData.match(regex)) {
                    messageId = message.id
                }
            }));
            if (!messageId) {
                throw new Error(`Email with ${subject} has not received`);
            }
            const text = await gmailAPI.getEmailById(messageId, format);
            if (parseHtml) {
                const string = await parseTextContent(text)
                return string.replace(/\n/g,' ').trim();
            } else {
                return text;
            }
        });
    }

    getMessageByExactPhraseInMessageBody(
      phrase: string,
      parseHtml = true,
      email = 'amazontestuserwdio@gmail.com',
      format: 'raw' | 'full' = 'raw',
    ) {
        return browser.call(async () => {
            const data = await gmailAPI.filterEmails(`to:${email} "${phrase}"`);
            let messageId = data.messages[0].id
            let messagesText = await gmailAPI.getEmailById(messageId, format);
            if (parseHtml) {
                const string = await parseTextContent(messagesText)
                return string.replace(/\n/g,' ').trim();
            } else {
                return messagesText;
            }
        });
    }
}