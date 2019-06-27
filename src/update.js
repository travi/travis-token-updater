import {factory as generateClient} from './github-client-factory';
import {choose} from './account';
import listJavaScriptRepoNames from './repos/determine-js-projects';
import chooseReposFromList from './repos/choose-from-list';
import setToken from './repos/set-token';

export default async function () {
  const octokit = generateClient();

  try {
    const account = await choose(octokit);
    const {jsProjects} = await listJavaScriptRepoNames(octokit, account);
    const chosenRepos = await chooseReposFromList(jsProjects);

    await setToken(chosenRepos, account);
  } catch (err) {
    process.exitCode = 1;
    console.error(err);                               // eslint-disable-line no-console
  }
}
