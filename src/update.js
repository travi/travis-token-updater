import {factory as generateClient} from './github/client-factory';
import {choose} from './account';
import listJavaScriptRepoNames from './github/determine-js-projects';
import chooseReposFromList from './github/choose-from-list';
import setToken from './github/set-token';
import netrc from '../third-party-wrappers/netrc';

export default async function ({githubAccount} = {}) {
  const octokit = generateClient(netrc()['github.com'].login);

  try {
    const account = githubAccount || await choose(octokit);
    const {jsProjects} = await listJavaScriptRepoNames(octokit, account);
    const chosenRepos = await chooseReposFromList(jsProjects);

    await setToken(chosenRepos, account);
  } catch (err) {
    process.exitCode = 1;
    console.error(err);                               // eslint-disable-line no-console
  }
}
