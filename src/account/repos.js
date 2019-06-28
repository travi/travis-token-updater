import {getDetails as getUserDetails} from './user';

async function accountTypeIsUser(account, octokit) {
  return account === (await getUserDetails(octokit)).login;
}

export async function listNames(octokit, account) {
  const options = await accountTypeIsUser(account, octokit)
    ? octokit.repos.list.endpoint.merge({affiliation: 'owner'})
    : octokit.repos.listForOrg.endpoint.merge({org: account});
  const repos = await octokit.paginate(options);

  return repos
    .filter(repo => !repo.archived)
    .map(repo => repo.name);
}
