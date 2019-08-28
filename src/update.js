import {factory as generateGithubClient} from './github/client-factory';
import generateTravisClient from './travis-ci/client-factory';
import {choose} from './account';
import listJavaScriptRepoNames from './github/determine-js-projects';
import chooseReposFromList from './github/choose-from-list';
import setToken from './travis-ci/set-token';
import netrc from '../third-party-wrappers/netrc';
import {expandDetailsFromNames} from './repos-expander';

export async function execute({githubAccount, githubAccessToken, octokit}) {
  const account = githubAccount || await choose(octokit);
  const {jsProjects, repos} = await listJavaScriptRepoNames(octokit, account);
  const chosenRepoNames = await chooseReposFromList(jsProjects);

  const [travisClient, proTravisClient] = await Promise.all([
    generateTravisClient(githubAccessToken),
    generateTravisClient(githubAccessToken, true)
  ]);

  await setToken(expandDetailsFromNames(chosenRepoNames, repos), account, travisClient, proTravisClient);
}

export default async function ({githubAccount} = {}) {
  const githubAccessToken = netrc()['github.com'].login;
  const octokit = generateGithubClient(githubAccessToken);

  try {
    await execute(({githubAccount, githubAccessToken, octokit}));
  } catch (err) {
    process.exitCode = 1;
    console.error(err);                               // eslint-disable-line no-console
  }
}
