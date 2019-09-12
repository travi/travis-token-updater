// #### Dependencies:
import yargs from 'yargs';
import {update as updateTravisTokens} from './lib/index.cjs';

// #### Register with the framework of your choise (yargs is used here)
yargs
  .scriptName('form8ion-utils')
  .usage('Usage: $0 <cmd> [args]')
  .command(
    'travis-tokens',
    'Roll token for Travis projects throughout the organization',
    () => updateTravisTokens({githubAccount: '<your github account here (optionally)>'})
  )
  .help('h')
  .alias('h', 'help')
  .argv;
