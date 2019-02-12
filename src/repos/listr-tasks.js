/* eslint no-param-reassign: off */
import {listNames as listRepoNamesFor} from '../account/repos';
import determineLanguageFrom from './determine-language-from-config';

export async function listRepoNames(context) {
  const {octokit, account} = context;

  context.repoNames = await listRepoNamesFor(octokit, account);
}

export function fetchTravisConfigFileFactory(repoName) {
  return async ({octokit, account, travisConfigs}, task) => octokit.repos.getContents({
    owner: account,
    repo: repoName,
    path: '.travis.yml'
  }).then(result => {
    task.title = `Fetched .travis.yml from ${repoName}`;

    travisConfigs[repoName] = result.data.content;
  }).catch(err => task.skip(
    `Received the following error when fetching .travis.yml from ${repoName}: ${err.message}`
  ));
}

export function determineJsProjects(context) {
  context.jsProjects = Object.entries(context.travisConfigs)
    .map(([repoName, config]) => 'node_js' === determineLanguageFrom(config) && repoName)
    .filter(Boolean);
}
