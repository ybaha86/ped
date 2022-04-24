import { AfterAll } from '@cucumber/cucumber';

import * as path from 'path';
import * as fs from 'fs-extra';

import {
  tms
} from '@qa/helper';

AfterAll (function () {
  if (process.env.QMETRY_KEY) {
    for (const result of __getCucumberJSONResult(path.join(process.cwd(), 'tmp', 'results', 'cucumber'))) {
      if (!result.endsWith('.sent')) {
        tms.report(result);
      }
    }
  }
});

function __getCucumberJSONResult (dir: string): string[] {
  let reports: string[] = [];

  for (let item of fs.readdirSync(dir)) {
    item = path.join(dir, item);

    const stat = fs.statSync(item);

    if (stat.isDirectory()) {
      reports = [
        ...reports,
        ...__getCucumberJSONResult(item)
      ];
    }

    if (stat.isFile()) {
      reports.push(item);
    }
  }

  return reports;
}
