export function expandDetailsFromNames(chosenRepoNames, repos) {
  return repos.filter(repo => chosenRepoNames.includes(repo.name));
}
