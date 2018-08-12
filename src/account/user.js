export async function getDetails(octokit) {
  const userData = await octokit.users.get();

  return userData.data;
}
