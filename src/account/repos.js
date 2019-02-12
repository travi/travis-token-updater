export async function listNames(octokit, account) {
  const options = octokit.repos.listForUser.endpoint.merge({username: account});
  const repos = await octokit.paginate(options);

  return repos.data.map(repo => repo.name);
}
