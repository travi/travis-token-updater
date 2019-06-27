import {prompt} from 'inquirer';
import Listr from '../../third-party-wrappers/listr';
import {setToken} from './listr-tasks';

export default async function (repos, account) {
  const {tokenName, tokenValue} = await prompt([
    {
      type: 'input',
      name: 'tokenName',
      message: 'What is the token that should be updated?'
    },
    {
      type: 'password',
      name: 'tokenValue',
      message: 'What is the token value?'
    }
  ]);

  const tasks = new Listr(
    repos.map(repoName => ({
      title: `Setting ${tokenName} for ${repoName}`,
      task: setToken(tokenName, tokenValue, account, repoName)
    })),
    {concurrent: true}
  );

  return tasks.run();
}
