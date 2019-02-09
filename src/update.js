import {factory as generateClient} from './github-client-factory';
import {choose} from './account';
import {listNames as listRepoNamesFor} from './account/repos';

export default async function () {
  const octokit = generateClient();
  const account = await choose(octokit);
  const repoNames = await listRepoNamesFor(octokit, account);

  console.log(repoNames);         // eslint-disable-line no-console
}
