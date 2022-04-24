import fs from 'fs-extra';
import got from 'got';
class QMetryTMS {

  report (result: string, {
    format = 'cucumber'
  } = {}) {

    browser.call(async () => {

      const feature = await fs.readFile(result);

      const { body } = await got.post(process.env.QTM_IMPORT!, {
        headers: {
          ['Cache-Control']: 'no-cache',
          ['Pragma']: 'no-cache',
          ['Connection']: 'close',
          ['apiKey']: process.env.QMETRY_KEY!
        },
        json: {
          format,
          testCycleToReuse: '', // TODO: capture tag for reusing test cycle
          attachFile: true,
          labels:(process.env.LABEL || 'AutoRegressionTest').toUpperCase(),
          isZip: false,
          environment: (process.env.INSTANCE || '').toUpperCase(),
          build: (process.env.BUILD || '').toUpperCase(),
          fields: {
            // testCycle will be ignored if testCycleToReuse is assigned
            testCycle: {
              summary: JSON.parse(feature.toString()).pop().name,
              description: (JSON.parse(feature.toString()).pop().description || '')
            },
            testCase: {
              description: (JSON.parse(feature.toString()).pop().description || '')
            }
          }
        }
      })

      await got.put(JSON.parse(body).url, {
        headers: {
          ['Cache-Control']: 'no-cache',
          ['Pragma']: 'no-cache',
          ['Connection']: 'close',
          ['Content-Type']: 'multipart/form-data',
          ['apiKey']: process.env.QMETRY_KEY!
        },
        body: feature
      });

      await fs.rename(result, result + '.sent');
    });

  }

}

export default new QMetryTMS();
