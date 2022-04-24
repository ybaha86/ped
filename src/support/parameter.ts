import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'section',
  regexp: /(.+) section/,
  transformer: (matched: string) => matched.toLowerCase()
});

defineParameterType({
  name: 'target',
  regexp: /.+/,
  transformer: (matched: string) => matched.toLowerCase()
});
