export async function getList(octokit) {
  const organizations = await octokit.users.getOrgs();

  return organizations.data;
}
