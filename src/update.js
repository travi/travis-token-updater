import {factory as generateClient} from './github-client-factory';
import {choose} from './account';
import listJavaScriptRepoNames from './repos/determine-js-projects';

export default async function () {
  const octokit = generateClient();

  try {
    const account = await choose(octokit);
    const {jsProjects} = await listJavaScriptRepoNames(octokit, account);

    console.log({jsProjects});    // eslint-disable-line no-console
  } catch (err) {
    process.exitCode = 1;
    console.error(err);                               // eslint-disable-line no-console
  }
}
