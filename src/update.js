import {factory as generateGithubClient} from './github/client-factory';
import generateTravisClient from './travis-ci/client-factory';
import {choose} from './account';
import listJavaScriptRepoNames from './github/determine-js-projects';
import chooseReposFromList from './github/choose-from-list';
import setToken from './github/set-token';
import netrc from '../third-party-wrappers/netrc';

export default async function ({githubAccount} = {}) {
  const githubAccessToken = netrc()['github.com'].login;
  const octokit = generateGithubClient(githubAccessToken);

  try {
    const account = githubAccount || await choose(octokit);
    const {jsProjects} = await listJavaScriptRepoNames(octokit, account);
    const chosenRepos = await chooseReposFromList(jsProjects);

    const [travisClient, proTravisClient] = await Promise.all([
      generateTravisClient(githubAccessToken),
      generateTravisClient(githubAccessToken, true)
    ]);

    await setToken(chosenRepos, account, travisClient, proTravisClient);
  } catch (err) {
    process.exitCode = 1;
    console.error(err);                               // eslint-disable-line no-console
  }
}
