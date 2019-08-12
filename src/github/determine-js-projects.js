import Listr from '../../third-party-wrappers/listr';
import {determineJsProjects, listRepos} from './listr-tasks';
import fetchTravisConfigFiles from './fetch-travis-config-files';

export default function (octokit, account) {
  const tasks = new Listr([
    {title: `Determining list of repositories for ${account}`, task: listRepos},
    {title: 'Fetching Travis-CI config files for each repository', task: fetchTravisConfigFiles},
    {title: 'Filtering to JavaScript projects', task: determineJsProjects}
  ]);

  return tasks.run({octokit, account, travisConfigs: {}});
}
