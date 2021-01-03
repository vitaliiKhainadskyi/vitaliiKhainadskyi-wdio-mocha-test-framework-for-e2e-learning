import {gmail_v1, google} from 'googleapis'
import {OAuth2Client} from 'google-auth-library';
const base64 = require('js-base64').Base64;
const parseTextContent = require('parse-html-text-content');

const gmail = require('node-gmail-api')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

/**
 * Credentials and token
 */
const credentials = JSON.parse(process.env.GMAIL_CREDENTIALS);
const TOKEN = JSON.parse(process.env.GMAIL_TOKEN);
const SCOPES = ['https://mail.google.com/'];

class GmailAPI {

    protected _OAuthClient: Promise<OAuth2Client> = null;
    protected _gmail: Promise<gmail_v1.Gmail> = null;

    /**
     * Creating an OAuth2 client with the given credentials
     * Needed for working with GmailAPI API
     */
    get OAuthClient() {
        if (this._OAuthClient === null) {
            this._OAuthClient = new Promise<OAuth2Client>((resolve, reject) => {
                const {client_secret, client_id, redirect_uris} = credentials.installed;
                const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
                oAuth2Client.setCredentials(TOKEN);
                resolve(oAuth2Client);
            });
        }
        return this._OAuthClient;
    }

    /**
     * Creating gmailclient with given OAUth2 client to acess gmail API methods
     */
    get gmailClient() {
        if (this._gmail === null) {
            this._gmail = this.OAuthClient.then((auth) => {
                return google.gmail({version: 'v1', auth});
            })
        }
        return this._gmail;
    }

    async getAllMessages() {
        const gmail = await this.gmailClient;
        let data = await gmail.users.messages.list({ userId: 'me' });
        return data.data;
    }

    async getMessageByQuery(query: string) {
        const gmail = await this.gmailClient;
        let data = await gmail.users.messages.list( { userId: 'me', q: query})
    }

    async getLastMessage() {
        const gmail = await this.gmailClient;
        let messagesData = null;
        await browser.waitUntil( () => {
            return browser.call( async () => {
                messagesData = await gmail.users.messages.list({ userId: 'me' })
            return messagesData.data.resultSizeEstimate !== 0
            })
        }, { timeout: 20000 })
        const lastMessageId = messagesData.data.messages[0].id;
        return await this.getEmailById(lastMessageId);
    }

    async getEmailById(id: string, format: 'raw' | 'full' = 'raw') {
        const gmail = await this.gmailClient;
        const message = await gmail.users.messages.get({ id, userId: 'me', format: 'raw'});
        if (format === 'raw') {
            return base64.decode(message.data.raw);
        } else {
            return base64.decode(message.data.payload.body.data);
        }
    }

    async filterEmails(query: string) {
        const gmail = await this.gmailClient;
        let messagesList = null;
        try {
            await browser.waitUntil( () => browser.call(async () => {
                messagesList = await gmail.users.messages.list({
                    userId: 'me',
                    q: query,
                });
                return messagesList.data.resultSizeEstimate !== 0
            }), { timeout: 240000 });
        } catch (e) {
            messagesList = await gmail.users.messages.list({
                userId: 'me'
            });
            const lastMessage = await this.getEmailById(messagesList.data.messages[0].id);
            const parsedText = await parseTextContent(lastMessage)
            throw new Error(`Query: "${query}" returned no matched emails after 60s. Last message is:` + parsedText)
        }

        return messagesList.data;
    }
}

export const gmailAPI = new GmailAPI();