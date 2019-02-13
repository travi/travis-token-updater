import {prompt} from 'inquirer';
import {getDetails as getUserDetails} from './user';
import {getList as getOrganizations} from './organizations';
import {organizationChooserShouldBePresented} from './prompt-predicates';

export async function choose(octokit) {
  const [organizations, userDetails] = await Promise.all([
    getOrganizations(octokit),
    getUserDetails(octokit)
  ]);
  const user = userDetails.login;

  const answers = await prompt([
    {
      name: 'userOrOrg',
      message: `Would you like to update your account (${user}) or an organization?`,
      type: 'list',
      choices: [user, 'organization']
    },
    {
      name: 'organization',
      message: 'Which organization\'s token would you like to update?',
      type: 'list',
      choices: organizations.map(organization => organization.login),
      when: organizationChooserShouldBePresented
    }
  ]);

  return user === answers.userOrOrg ? answers.userOrOrg : answers.organization;
}
