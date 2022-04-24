import fs from 'fs-extra';
import path from 'path';
import neat from 'neat-csv';
import { Chance } from 'chance';

class QAChance extends Chance {
   /**
     * for returning random bank name on given country
     * @param country default value is 'SG'
     */
  bank (country?:string) {
    country = country ?country :'SG'
    return this.pickone(
      browser.call(async () => {
        const data: { [id: string]: string }[] = [];

        (await neat(
          await fs.readFile(path.join('fixtures', 'references', 'bank-name.csv'))
        )).forEach((record) => { if (record.country === country) data.push(record); });
        return data
      }) as { [id: string]: string }[]
    ).name;
  }
  /**
   * for returning random business industries name on given country
   * @param country
   * @returns string of business industries name
   */
  businessindustry (country?: string) {
    country = country ?country :'SG'
    return this.pickone(
      browser.call(async () => {
        const data: { [id: string]: string }[] = [];

        (await neat(
          await fs.readFile(path.join('fixtures', 'references', 'business-industry.csv'))
        )).forEach((record) => { if (record.country === country) data.push(record); });

        return data
      }) as { [id: string]: string }[]
    ).industry;
  }

  postalcode (country?: string) {
    const reference = this.pickone(
      browser.call(async () => {
        const data: { [id: string]: string }[] = [];

        (await neat(
          await fs.readFile(path.join('fixtures', 'references', 'postal-code.csv'))
        )).forEach((record) => { if (record.country === country) data.push(record); });

        return data
      }) as { [id: string]: string }[]
    );

    return this.natural({ min: parseInt(reference.min), max: parseInt(reference.max) });
  }

  relationship () {
    return this.pickone(
      browser.call(async () => {
        return await neat(
          await fs.readFile(path.join('fixtures', 'references', 'relationship.csv'))
        );
      }) as { [id: string]: string }[]
    ).relationship;
  }

  tenure (country?: string) {
    return this.pickone(
      browser.call(async () => {
        const data: { [id: string]: string }[] = [];

        (await neat(
          await fs.readFile(path.join('fixtures', 'references', 'tenure.csv'))
        )).forEach((record) => { if (record.country === country) data.push(record); });

        return data
      }) as { [id: string]: string }[]
    ).tenure;
  }

  companytype (country?: string) {
    return this.pickone(
      browser.call(async () => {
        const data: { [id: string]: string }[] = [];

        (await neat(
          await fs.readFile(path.join('fixtures', 'references', 'company-type.csv'))
        )).forEach((record) => { if (record.country === country) data.push(record); });

        return data
      }) as { [id: string]: string }[]
    ).type;
  }

  nric ({ country = process.env.COUNTRY } = {}) {
    switch (country) {
      case 'ID': return this.__nric_id();
      case 'MY': return this.__nric_my();
      case 'SG': return this.__nric_sg();
    }
  }

  uen ({ country = process.env.COUNTRY } = {}) {
    switch (country) {
      case 'ID': return this.__uen_id();
      case 'MY': return this.__uen_my();
      case 'SG': return this.__uen_sg();
    }
  }

  private __nric_id () {
    const dob = this.date({
      american: false,
      string: false,
      year: (new Date().getFullYear() - this.integer({ min: 0, max: 10 }))
    }) as Date;

    const YY = dob.getFullYear().toString().substr(2);
    const mm = `${dob.getMonth()}`.padStart(2, '0');
    const dd = `${dob.getDate()}`.padStart(2, '0');

    const PPRRSS = `${chance.integer({ min: 1, max: 99999 })}`.padStart(6, '0');
    const nnnn = `${chance.integer({ min: 1, max: 999 })}`.padStart(4, '0');

    return PPRRSS + dd + mm + YY + nnnn;
  }

  private __nric_my () {
    const dob = this.date({
      american: false,
      string: false,
      year: (new Date().getFullYear() - this.integer({ min: 0, max: 10 }))
    }) as Date;

    const YY = dob.getFullYear().toString().substr(2);
    const mm = `${dob.getMonth()}`.padStart(2, '0');
    const dd = `${dob.getDate()}`.padStart(2, '0');

    const nnnn = `${chance.integer({ min: 1, max: 9999 })}`.padStart(4, '0');

    /** state */
    let PB = '00';
    while ([
      '00', '17', '18', '19', '20', '69', '70',
      '73', '80', '81', '94', '95', '96', '97'
    ].includes(PB)) {
      PB = chance.integer({ min: 1, max: 99 }).toString().padStart(2, '0');
    }

    return YY + mm + dd + PB + nnnn;
  }

  private __nric_sg ({ foreigner = false } = {}) {
    const dob = this.date({
      american: false,
      string: false,
      year: (new Date().getFullYear() - this.integer({ min: 0, max: 10 }))
    }) as Date;

    let prefix = '?';
    if (dob.getFullYear() < 2000) prefix = foreigner ? 'F' : 'S';
    if (dob.getFullYear() > 1999) prefix = foreigner ? 'G' : 'T';

    const YY = dob.getFullYear().toString().substr(2);
    const nnnnn = `${chance.integer({ min: 1, max: 99999 })}`.padStart(5, '0');

    const digits = (YY + nnnnn).split('').map(Number);
    digits[0] *= 2;
    digits[1] *= 7;
    digits[2] *= 6;
    digits[3] *= 5;
    digits[4] *= 4;
    digits[5] *= 3;
    digits[6] *= 2;

    let sum = 0;
    for (const digit of digits) {
      sum += digit;
    }

    const offset = (prefix === 'T' || prefix === 'G') ? 4 : 0;

    let X = '?';
    switch (prefix) {
      case 'F':
      case 'G':
        X = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'][(offset + sum) % 11];
        break;

      case 'S':
      case 'T':
        X = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'][(offset + sum) % 11];
        break;
    }

    return prefix + YY + nnnnn + X;
  }

  private __uen_id () {
    const establish = this.date({
      american: false,
      string: false,
      year: (new Date().getFullYear() - this.integer({ min: 0, max: 10 }))
    }) as Date;
    return '';
  }

  private __uen_my () {
    const establish = this.date({
      american: false,
      string: false,
      year: (new Date().getFullYear() - this.integer({ min: 0, max: 10 }))
    }) as Date;

    const YYYY = establish.getFullYear();
    const xx = `${chance.integer({ min: 1, max: 6 })}`.padStart(2, '0');
    const nnnnnn = `${chance.integer({ min: 1, max: 999999 })}`.padStart(6, '0');

    return YYYY + xx + nnnnnn; // https://www.mydata-ssm.com.my/announcement?id=2
  }

  private __uen_sg (): string {
    const establish = this.date({
      american: false,
      string: false,
      year: (new Date().getFullYear() - this.integer({ min: 0, max: 10 }))
    }) as Date;

    const format = this.pickone(['A', 'B', 'C']); // https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx

    let PQ!: string;
    let YY!: string;
    let YYYY!: string;
    let nnnn!: string;
    let nnnnn!: string;
    let nnnnnnnnn!: string;
    let prefix!: string;
    let uen!: string;

    switch (format) {
      case 'A':
        nnnnnnnnn = `${this.integer({ min: 1, max: 99999999 })}`.padStart(9, '0');

        uen = nnnnnnnnn + 'X';
        break;

      case 'B':
        YYYY = `${establish.getFullYear()}`;
        nnnnn = `${this.integer({ min: 1, max: 9999 })}`.padStart(5, '0');

        uen = YYYY + nnnnn + 'X';
        break;

      case 'C':
        prefix =
          (establish.getFullYear() >= 1800) ? 'R' :
          (establish.getFullYear() >= 1900) ? 'S' : 'T';

        YY = establish.getFullYear().toString().substr(2);
        nnnn = `${this.integer({ min: 1, max: 999 })}`.padStart(4, '0');

        PQ = this.pickone([
          'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS', 'DP', 'CP', 'NR', 'CM', 'CD', 'MD',
          'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX', 'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM', 'GA', 'GB'
        ]);

        uen = prefix + YY + PQ + nnnn + 'X';
        break;
    }

    return uen;
  }
}

export const chance = new QAChance();
