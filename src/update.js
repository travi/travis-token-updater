import {factory as generateClient} from './github-client-factory';
import listJavaScriptRepoNames from './repos/determine-js-projects';
import Listr from '../third-party-wrappers/listr';
import {chooseAccount} from './listr-tasks';

export default async function () {
  const tasks = new Listr([
    {title: 'Determining account', task: chooseAccount},
    {title: 'Finding JavaScript Projects', task: listJavaScriptRepoNames}
  ]);
  const octokit = generateClient();

  try {
    const {jsProjects} = await tasks.run({octokit, travisConfigs: {}});

    console.log({jsProjects});                        // eslint-disable-line no-console
  } catch (err) {
    process.exitCode = 1;
    console.error(err);                               // eslint-disable-line no-console
  }
}
