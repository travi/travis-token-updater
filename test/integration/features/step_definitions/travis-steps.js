import {Given, Then, When} from 'cucumber';
import {execute} from '../../../../src/update';
import {factory as generateGithubClient} from '../../../../src/github/client-factory';

Given('the project is {word}', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('the token is set', async function () {
  const octokit = generateGithubClient(this.githubAccessToken);

  await execute({githubAccessToken: this.githubAccessToken, octokit});
});

Then('the token is updated on the {word} Travis instance', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});
