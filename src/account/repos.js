import {getDetails as getUserDetails} from './user';

async function accountTypeIsUser(account, octokit) {
  return account === (await getUserDetails(octokit)).login;
}

export async function listNames(octokit, account) {
  const options = await accountTypeIsUser(account, octokit)
    ? octokit.repos.list.endpoint.merge({})
    : octokit.repos.listForOrg.endpoint.merge({org: account});
  const repos = await octokit.paginate(options);

  return repos.data.map(repo => repo.name);
}
