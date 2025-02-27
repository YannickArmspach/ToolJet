import { ssoSelector } from "Selectors/manageSSO";
import * as common from "Support/utils/common";
import { ssoText } from "Texts/manageSSO";
import * as SSO from "Support/utils/manageSSO";
import { commonSelectors } from "Selectors/common";
import { commonText } from "Texts/common";
import { usersSelector } from "Selectors/manageUsers";
import { usersText } from "Texts/manageUsers";
import * as archiveUser from "Support/utils/manageUsers";
import * as unarchiveUser from "Support/utils/manageUsers";

describe("SSO onboarding", () => {
  before(() => {
    cy.appUILogin();
    SSO.enableSignUp();
    SSO.enableGoogleSSO();
    SSO.enableGitHubSSO();
    common.logout(); 
    SSO.updateId();
  });
  it("Should verify Google SSO user onboarding", () => {
    cy.visit("/");
    SSO.googleSSO(Cypress.env("google_user"), Cypress.env("sso_password"));
    cy.clearAndType(commonSelectors.passwordInputField, "password");
    cy.get(commonSelectors.acceptInviteButton).click();
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      usersText.swPasswordSuccessToast
    );
    cy.get(usersSelector.dropdownText).verifyVisibleElement(
      "have.text",
      "My workspace"
    );
    common.logout();
  });
  it("Should verify the enable signup functionality and GitHub SSO user onboaring", () => {
    cy.appUILogin();
    SSO.disableSignUp();
    common.logout();

    SSO.gitHubSSO(Cypress.env("git_user"), Cypress.env("sso_password"));
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      ssoText.gitUserStatusToast
    );

    cy.appUILogin();
    SSO.enableSignUp();
    common.logout();

    cy.get(ssoSelector.gitSignInText).click();
    SSO.invitePageElements();
    cy.clearAndType(commonSelectors.passwordInputField, "password");
    cy.get(commonSelectors.acceptInviteButton).click();
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      usersText.swPasswordSuccessToast
    );
    cy.get(usersSelector.dropdownText).verifyVisibleElement(
      "have.text",
      "My workspace"
    );
    common.logout();
  });
  it("Should verify archived user login using SSO", () => {
    cy.appUILogin();
    archiveUser.userStatus(Cypress.env("git_user"));
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      usersText.archivedToast
    );
    common.logout();

    SSO.gitHubSSO(Cypress.env("git_user"), Cypress.env("sso_password"));
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      ssoText.gitUserStatusToast
    );

    cy.appUILogin();
    unarchiveUser.userStatus(Cypress.env("git_user"));
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      usersText.unarchivedToast
    );
    common.logout();

    cy.get(ssoSelector.gitSignInText).click();
    cy.wait(500);
    cy.get(usersSelector.dropdownText).verifyVisibleElement(
      "have.text",
      "My workspace"
    );
    common.logout();
  });

  it("Should verify GitHub and Google SSO login", () => {
    cy.visit("/");
    SSO.loginbyGitHub(Cypress.env("git_user"), Cypress.env("sso_password"));
    cy.visit("/");
    cy.get(usersSelector.dropdownText).verifyVisibleElement(
      "have.text",
      "My workspace"
    );
    common.logout();

    cy.reload();
    cy.wait(500)
    SSO.googleSSO(Cypress.env("google_user"), Cypress.env("sso_password"));
    cy.get(usersSelector.dropdownText).verifyVisibleElement(
      "have.text",
      "My workspace"
    );
    common.logout();
  });
});