import allure from '@wdio/allure-reporter'

class RegisterPage {

  /** Locators **/
  nameInput(): WebdriverIO.Element {
    return $('#ap_customer_name');
  }

  passwordInput(): WebdriverIO.Element {
    return $('#ap_email')
  }

  reWEnterPasswordInput(): WebdriverIO.Element {
    return $('#ap_password_check')
  }

  createAccountButton(): WebdriverIO.Element {
    return $('#continue')
  }

  /** Page Methods **/
  fillNameInput(name: string) {
    allure.startStep(`Fill name input with ${name} value`)
    this.nameInput().setValue(name);
    allure.endStep();
    return this;
  }

  fillPasswordInput(password: string) {
    allure.startStep(`Fill password input with ${password} value`)
    this.passwordInput().setValue(password)
    allure.endStep();
    return this;
  }

  fillReEnterPasswordInput(password: string) {
    allure.startStep(`Fill re-enter password input with ${password} value`)
    this.reWEnterPasswordInput().setValue(password);
    allure.endStep();
    return this;
  }

  clickCreateAccountButton() {
    allure.startStep(`Click create account button`)
    this.createAccountButton().click();
    allure.endStep();
    return
  }
}

export const registerPage = new RegisterPage();