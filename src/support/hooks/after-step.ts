import fs from 'fs-extra';
import path from 'path';
import { AfterStep, Status } from '@cucumber/cucumber';
import * as QA from '@qa/core';

const result = {
  [Status.AMBIGUOUS]: 'ambiguous',
  [Status.FAILED]: 'failed',
  [Status.PASSED]: 'passed',
  [Status.PENDING]: 'pending',
  [Status.SKIPPED]: 'skipped',
  [Status.UNDEFINED]: 'undefined',
  [Status.UNKNOWN]: 'unknown'
};

AfterStep (function (this: QA.Core, step) {
  const file = step.gherkinDocument.uri!.replace(/.+features/, path.join(process.cwd(), 'tmp', 'results', 'cucumber')) + '.json';
  const feature = JSON.parse(fs.readFileSync(file, 'ascii')).pop();

  for (const child in feature.elements) {
    if (feature.elements[child].name !== step.pickle.name) {
      continue;
    }

    for (const idx in feature.elements[child].steps) {
      if (!feature.elements[child].steps[idx].result.status) {
        feature.elements[child].steps[idx].result.status = result[step.result.status!] ;
        break
      }
    }
  }

  fs.writeJSONSync(file, [feature]);

  if(result[step.result.status!] !== 'passed') {
    process.env.IS_TC_SKIPPED = 'true';
  }
});
