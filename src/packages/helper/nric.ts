import { chance } from './chance';
import { dateOfBirth } from './date-of-birth';

export function nric (country?: string, { dob }: { dob?: Date } = {}): string | undefined {
  switch (country) {
    case 'ID': return _fn_id_nric({ dob });
    case 'MY': return _fn_my_nric({ dob });
    case 'SG': return _fn_sg_nric({ dob });
  }
}

function _fn_id_nric ({ dob = dateOfBirth() }) {

  const YY = dob.getFullYear().toString().substr(2);
  const mm = `${dob.getMonth()}`.padStart(2, '0');
  const dd = `${dob.getDate()}`.padStart(2, '0');

  const PPRRSS = `${chance.integer({ min: 1, max: 99999 })}`.padStart(6, '0');
  const nnnn = `${chance.integer({ min: 1, max: 999 })}`.padStart(4, '0');

  return PPRRSS + dd + mm + YY + nnnn;
}

function _fn_my_nric ({ dob = dateOfBirth() }) {

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

function _fn_sg_nric ({ dob = dateOfBirth(), foreigner = false } = {}) {

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
