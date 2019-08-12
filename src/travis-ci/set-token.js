import {prompt} from 'inquirer';
import Listr from '../../third-party-wrappers/listr';
import {requireTokenValue} from '../prompt-validations';
import getActiveInstanceTokenSetter from './set-token-on-active-instance';

export default async function (repos, account, travisClient, proTravisClient) {
  const {tokenName, tokenValue} = await prompt([
    {
      type: 'list',
      name: 'tokenName',
      choices: ['NPM_TOKEN', 'GH_TOKEN'],
      message: 'What is the token that should be updated?'
    },
    {
      type: 'password',
      name: 'tokenValue',
      message: 'What is the token value?',
      validate: requireTokenValue
    }
  ]);

  const tasks = new Listr(
    repos.map(repository => ({
      title: `Setting ${tokenName} for ${repository.name}`,
      task: getActiveInstanceTokenSetter(tokenName, tokenValue, account, repository, travisClient, proTravisClient)
    })),
    {concurrent: true}
  );

  return tasks.run();
}
