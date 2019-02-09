/* eslint no-param-reassign: off */
import {listNames as listRepoNamesFor} from '../account/repos';

export async function listRepoNames(context) {
  const {octokit, account} = context;

  const repoNames = await listRepoNamesFor(octokit, account);

  context.repoNames = repoNames;
}
