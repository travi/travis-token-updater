/* eslint no-param-reassign: off */
import {listNames as listRepoNamesFor} from '../account/repos';

export async function listRepoNames(context) {
  const {octokit, account} = context;

  context.repoNames = await listRepoNamesFor(octokit, account);
}
