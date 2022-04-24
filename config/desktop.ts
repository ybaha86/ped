import path from 'path';

const {
  automationProtocol,
  services,
  capabilities
} = require('./browsers/' + (process.env.BROWSER || 'chrome')); // eslint-disable-line @typescript-eslint/no-var-requires

const waittime = {
  interval: parseInt(process.env.WAITTIME_INTERVAL!),
  timeout: parseInt(process.env.WAITTIME_TIMEOUT!)
};

const tag_expression: { [id: string]: string } = {
  'ID': ' and (@ID or (not @MY and not @SG and not @TH and not @ZI and not @ZU))',
  'MY': ' and (@MY or (not @ID and not @SG and not @TH and not @ZI and not @ZU))',
  'SG': ' and (@SG or (not @ID and not @MY and not @TH and not @ZI and not @ZU))',
  'TH': ' and (@TH or (not @ID and not @MY and not @SG and not @ZI and not @ZU))',
  'ZI': ' and (@ZI or (not @ID and not @MY and not @SG and not @TH and not @ZU))',
  'ZU': ' and (@ZU or (not @ZI and not @ID and not @MY and not @SG and not @TH))',
};

if (process.env.INTERCEPTOR && !['0', 'false'].includes(process.env.INTERCEPTOR)) {
  services.push('intercept');
}

// https://github.com/webdriverio/webdriverio/blob/main/examples/wdio.conf.js
export const config: WebdriverIO.Config = {

  automationProtocol,
  capabilities,
  services,
  maxInstances: 1,

  waitforInterval: waittime.interval,
  waitforTimeout: waittime.timeout,

  reporters: [
    'spec', [
      'allure', {
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        useCucumberStepReporter: true,
        disableMochaHooks: true,

        outputDir: path.join(
          (process.env.RESULTS_PATH || path.join(process.cwd(), 'tmp', 'results')), 'allure', 'desktop'
        )
      }
    ]
  ],

  framework: 'cucumber',

  // https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-cucumber-framework/src/types.ts
  cucumberOpts: {
    // https://docs.cucumber.io/cucumber/api/#tag-expressions
    tagExpression: 'not @ignore' + (tag_expression[process.env.COUNTRY!] + (!process.env.VIEWPORT_TYPE?.includes('Desktop') ? ' and @mobile-viewport' : '') || ''),

    backtrace: true,
    requireModule: [
      'tsconfig-paths/register'
    ],
    require: [
      path.join(process.cwd(), 'src', 'step_definitions', '**', '*.ts'),
      path.join(process.cwd(), 'src', 'support', '**', '*.ts')
    ],
    failFast: false,
    snippets: true,
    source: true,
    profile: [],
    strict: true,
    timeout: 600000,
    ignoreUndefinedDefinitions: true,

    failAmbiguousDefinitions: false,
    tagsInTitle: false,
    scenarioLevelReporter: false,
    names: (process.env.CUCUMBER_SCENARIO_NAME?.split('|') || []),
    order: 'defined',
    featureDefaultLanguage: 'en'
  }
};

process.env.TAG_EXPRESSION = config.cucumberOpts?.tagExpression;
