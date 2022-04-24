import { chance } from './chance';

export function dateOfBirth ({ min = 20, max = 75 } = {}) {
  const age = chance.integer({ min, max });

  const YYYY = `${(new Date().getFullYear() - age)}`;
  const mm = `${chance.integer({ min: 1, max: 12 })}`.padStart(2, '0');
  const dd = `${chance.integer({ min: 1, max: 28 })}`.padStart(2, '0');

  return new Date(`${YYYY}-${mm}-${dd}`);
}
