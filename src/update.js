import {factory as generateClient} from './github-client-factory';
import {choose} from './account';

export default async function () {
  const octokit = generateClient();

  const account = await choose(octokit);

  const repos = await octokit.repos.listForUser({username: account});

  const repoNames = repos.data.map(repo => repo.name);

  console.log(repoNames);         // eslint-disable-line no-console
}
