export async function listNames(octokit, account) {
  const repos = await octokit.repos.listForUser({username: account});

  return repos.data.map(repo => repo.name);
}
