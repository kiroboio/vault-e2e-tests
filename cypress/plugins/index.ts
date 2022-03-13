/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
import { Puppeteer } from './Puppeteer';
import path from 'path';

module.exports = (on: Cypress.PluginEvents, _config: Cypress.Config) => {
  const { connectBrowser, setPages, loginToMetamask, confirm } = Puppeteer;
  
  on('task', {
    connectBrowser,
    setPages,
    loginToMetamask,
    confirm,
  });

  on(
    'before:browser:launch',
    (_browser: Cypress.Browser, launchOptions: Cypress.BrowserLaunchOptions) => {

      console.log("before browser launch")
      const pathToExtension = path.join(__dirname, 'Metamask');
      console.log("broser set remote")
      launchOptions.args.push('--remote-debugging-port=9222');
      launchOptions.extensions.push(pathToExtension);

      return launchOptions;
    }
  );
};
