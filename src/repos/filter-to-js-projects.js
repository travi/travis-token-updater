import Listr from '../../third-party-wrappers/listr';
import {listRepoNames} from './listr-tasks';
import fetchTravisConfigFiles from './fetch-travis-config-files';

export default function (octokit, account) {
  const tasks = new Listr([
    {
      title: `Determining list of repositories for ${account}`,
      task: listRepoNames
    },
    {
      title: 'Fetching Travis-CI config files for each repository',
      task: fetchTravisConfigFiles
    }
  ]);

  return tasks.run({octokit, account});
}
