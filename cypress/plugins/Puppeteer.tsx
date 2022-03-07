import puppeteer from 'puppeteer';
import axios from 'axios';

const METAMASK_NEW_PENDING_TRANSACTION_SELECTOR =
  '.transaction-list__pending-transactions > .transaction-list-item--unconfirmed';
const METAMASK_CONFIRM_BUTTON_SELECTOR = '.btn-primary';
export class Puppeteer {
  public static connectBrowser = async () => {
    const { data: debuggerInfo } = await axios.get(`http://localhost:9222/json/version`);

    const browser = await puppeteer.connect({
      browserWSEndpoint: debuggerInfo.webSocketDebuggerUrl,
      ignoreHTTPSErrors: true,
      defaultViewport: null,
    });

    Puppeteer.browser = browser;
    return null;
  };

  public static setPages = async () => {
    if (!Puppeteer.browser)
      throw new Error(
        'Puppeteer browser not set run connect method before login to metamask '
      )
    const pages = await Puppeteer.browser.pages()
    for (const page of pages) {
      if (page.url().includes('vault')) {
        Puppeteer.mainPage = page
      }
      if (page.url().includes('chrome-extension')) {
        Puppeteer.metamaskPage = page
      }
    }
    await Puppeteer.metamaskPage?.bringToFront()

    return null;
  }

  public static loginToMetamask = async ({ password }: { password: string }) => {
    if (!Puppeteer.metamaskPage) throw new Error('Puppeteer metamask page not set');
    await Puppeteer.metamaskPage.waitForTimeout(2000);
    await Puppeteer.gotoMetamaskPage();

    await Puppeteer.metamaskPage.type('#password', password);
    await Puppeteer.metamaskPage.click('.button');

    await Puppeteer.gotoMainPage();
    return null;
  };

  public static confirm = async () => {
    if (!Puppeteer.metamaskPage) throw new Error('Puppeteer metamask page not set');
    await Puppeteer.gotoMetamaskPage();
    await Puppeteer.metamaskPage.waitForTimeout(4000);
    await Puppeteer.metamaskPage.waitForSelector(METAMASK_NEW_PENDING_TRANSACTION_SELECTOR);
    await Puppeteer.metamaskPage.click(METAMASK_NEW_PENDING_TRANSACTION_SELECTOR);

    await Puppeteer.metamaskPage.waitForSelector(METAMASK_CONFIRM_BUTTON_SELECTOR);
    await Puppeteer.metamaskPage.waitForTimeout(5000);
    await Puppeteer.metamaskPage.click(METAMASK_CONFIRM_BUTTON_SELECTOR);

    await Puppeteer.gotoMainPage();
    return null;
  };

  private static browser: puppeteer.Browser | undefined;
  private static metamaskPage: puppeteer.Page | undefined;
  private static mainPage: puppeteer.Page | undefined;

  private static gotoMetamaskPage = async () => {
    if (!Puppeteer.metamaskPage) throw new Error('Metamask page not set');
    await Puppeteer.metamaskPage.bringToFront();
  };

  private static gotoMainPage = async () => {
    if (!Puppeteer.mainPage) throw new Error('Main page not set');
    await Puppeteer.mainPage.bringToFront();
  };

}
