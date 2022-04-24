import { chance } from './chance';
import { dateOfBirth } from './date-of-birth';

export function uen (country?: string, { dob }: { dob?: Date } = {}): string | undefined {
  switch (country) {
    case 'ID': return _fn_id_uen({ dob });
    case 'MY': return _fn_my_uen({ dob });
    case 'SG': return _fn_sg_uen({ dob });
  }
}

function _fn_id_uen ({ dob = dateOfBirth({ min: 1, max: 30 }) }) {
  // TODO: placeholder for generating ID UEN
  return '';
}

function _fn_my_uen ({ dob = dateOfBirth({ min: 1, max: 30 }) }) {

  const YYYY = dob.getFullYear();
  const xx = `${chance.integer({ min: 1, max: 6 })}`.padStart(2, '0');
  const nnnnnn = `${chance.integer({ min: 1, max: 999999 })}`.padStart(6, '0');

  return YYYY + xx + nnnnnn; // https://www.mydata-ssm.com.my/announcement?id=2
}

function _fn_sg_uen ({ dob = dateOfBirth({ min: 1, max: 30 }) }) {

  const format = chance.pickone(['A', 'B', 'C']); // https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx

  let X = 'X';
  let uen = '?';
  switch (format) {
    case 'A':
      const nnnnnnnnn = `${chance.integer({ min: 1, max: 99999999 })}`.padStart(9, '0');

      uen = nnnnnnnnn + X;
      break;

    case 'B':
      const YYYY = dob.getFullYear();
      const nnnnn = `${chance.integer({ min: 1, max: 9999 })}`.padStart(5, '0');

      uen = YYYY + nnnnn + X;
      break;

    case 'C':
      let prefix = '?';
      if (dob.getFullYear() >= 1800) prefix = 'R';
      if (dob.getFullYear() >= 1900) prefix = 'S';
      if (dob.getFullYear() >= 2000) prefix = 'T';

      const YY = dob.getFullYear().toString().substr(2);
      const nnnn = `${chance.integer({ min: 1, max: 999 })}`.padStart(4, '0');

      const PQ = chance.pickone([
        'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS', 'DP', 'CP', 'NR', 'CM', 'CD', 'MD',
        'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX', 'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM', 'GA', 'GB'
      ]);

      uen = prefix + YY + PQ + nnnn + X;
      break;
  }

  return uen;
}
