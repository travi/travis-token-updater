import Listr from '../../third-party-wrappers/listr';
import {listRepoNames} from './listr-tasks';
import fetchTravisConfigFiles from './fetch-travis-config-files';
import filterToJsProjects from './filter-to-js-projects';

export default function (octokit, account) {
  const tasks = new Listr([
    {
      title: `Determining list of repositories for ${account}`,
      task: listRepoNames
    },
    {
      title: 'Fetching Travis-CI config files for each repository',
      task: fetchTravisConfigFiles
    },
    {
      title: 'Filtering to JavaScript projects',
      task: filterToJsProjects
    }
  ]);

  return tasks.run({octokit, account, travisConfigs: {}});
}
