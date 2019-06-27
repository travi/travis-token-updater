export async function getList(octokit) {
  const organizations = await octokit.orgs.listForAuthenticatedUser();

  return organizations.data;
}
