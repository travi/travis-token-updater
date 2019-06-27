export async function getDetails(octokit) {
  const userData = await octokit.users.getAuthenticated();

  return userData.data;
}
