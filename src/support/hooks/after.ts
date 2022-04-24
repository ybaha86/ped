import { After } from '@cucumber/cucumber';
import allure from '@wdio/allure-reporter';
import * as QA from '@qa/core'

After ({ tags: process.env.TAG_EXPRESSION }, function (this: QA.Core, step) {

  allure.addAttachment('Scenario end screenshot',
    Buffer.from(browser.takeScreenshot(), 'base64'), 'image/png'
  );

  for (const [k, v] of this.data) {
    if (k !== 'reference') allure.addArgument(k, (v instanceof String) ? v : v.toString());
  }

  if (this.getContext()) {
    this.reset({ reload: false });
  }
});
