import allure from '@wdio/allure-reporter';

export class Context {
  id = process.env.PRODUCTID||'tokped';
  url ='https://' +(process.env.URL);

  constructor() {
    allure.addArgument(this.id, this.url);
  }

  start() {
    browser.navigateTo(this.url);

    allure.addStep('Open ' + this.url, {
      name: 'Page screenshot', content: Buffer.from(browser.takeScreenshot(), 'base64'), type: 'image/png'
    });
    if (process.env.INTERCEPTOR && !['0', 'false'].includes(process.env.INTERCEPTOR)) {
      browser.setupInterceptor()
    }
  }

  get signed_in (): boolean {
    return browser.execute(() => {
      const store = localStorage.getItem('AkitaStores');
      return (!store) ? false : JSON.parse(store).auth['isLoggedIn'];
    });
  }

  awaitSignedInToken () {
    browser.waitUntil(() => {
      return (
        browser.execute(() => {
          const store = localStorage.getItem('AkitaStores');
          return (!store) ? false : JSON.parse(store).auth['isLoggedIn'];
        }) &&
        browser.execute(() => {
          const store = sessionStorage.getItem('AkitaStores');
          return (!store) ? false : JSON.parse(store).auth['bearerToken'];
        })
      );
    });
  }
}
