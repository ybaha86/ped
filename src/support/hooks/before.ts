import fs from 'fs-extra';
import path from 'path';
import allure from '@wdio/allure-reporter';
import { Before } from '@cucumber/cucumber';
import * as QA from '@qa/core';


function resetDesktop(this:QA.Core){
  if (process.env.VIEWPORT_TYPE?.includes('Desktop')) {
    const screen = {
      x: parseInt(process.env.SCREEN_X!),
      y: parseInt(process.env.SCREEN_Y!),
      width: parseInt(process.env.SCREEN_WIDTH!),
      height: parseInt(process.env.SCREEN_HEIGHT!)
    };

    browser.setWindowRect(
      screen.x,
      screen.y,
      screen.width,
      screen.height
    );
  }
}
Before (function (this: QA.Core) {
  // Reset session on subsequent scenario
  if (this.getContext()) {
    this.reset();
  }
  resetDesktop.call(this)
});

Before ({ tags: process.env.TAG_EXPRESSION }, function (this: QA.Core) {
  allure.addEnvironment('DISPLAY', process.env.DISPLAY!);
  allure.addEnvironment('INSTANCE', process.env.INSTANCE!);
  allure.addEnvironment('PLATFORM', process.env.PLATFORM!);

  allure.addArgument('COUNTRY', process.env.COUNTRY!);
});


Before({ tags: '@continuousScenarioON' }, function (this: QA.Core) {
  // Use this tags to skip the browser reload session
  process.env.ISCOUNTINUOSSCENARIO = 'TRUE'
});
Before({ tags: '@continuousScenarioOFF' }, function (this: QA.Core) {
  // Use this tags to toggle ON the browser reload session
  process.env.ISCOUNTINUOSSCENARIO = 'FALSE'
  console.log('OFF scenario')
  this.reset({reload:true});
});
Before({ tags: '@forceReloadSession' }, function (this: QA.Core) {
  // Use this tags to force the browser reload session
  this.reset({reload:true});
  resetDesktop.call(this)
});

// prepare cucumber json report
Before (function (this: QA.Core, scenario) {
  const file = scenario.gherkinDocument.uri!.replace(/.+features/, path.join(process.cwd(), 'tmp', 'results', 'cucumber')) + '.json';
  const feature = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'ascii')).pop() :
  {
    tags: scenario.gherkinDocument.feature!.tags || [],
    type: 'feature',
    name: scenario.gherkinDocument.feature!.name!.trim(),
    description: scenario.gherkinDocument.feature!.description!.trim(),
    keyword: scenario.gherkinDocument.feature!.keyword!.trim(),
    elements: []
  };

  for (const child of scenario.gherkinDocument.feature!.children!) {
    for (const idx in feature.elements) {
      // Avoid adding duplicate test scenario into cucumber json report
      if (feature.elements[idx].name === child.scenario!.name!.trim()) {
        return;
      }
    }

    feature.elements.push({
      tags: child.scenario!.tags || [],
      type: 'scenario',
      name: child.scenario!.name!.trim(),
      description: child.scenario!.description!.trim(),
      keyword: child.scenario!.keyword!.trim(),
      steps: []
    });

    for (const step of child.scenario!.steps!) {
      feature.elements[feature.elements.length - 1].steps.push({
        name: step.text!.trim(),
        keyword: step.keyword!.trim(),
        arguments: [],
        result: {}
      })
    }
  }

  fs.mkdirpSync(path.dirname(file));
  fs.writeJSONSync(file, [feature]);
});
