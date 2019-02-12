/* eslint no-param-reassign: off */
import prompt from '../third-party-wrappers/listr-inquirer';
import {getList as getOrganizations} from './account/organizations';
import {getDetails as getUserDetails} from './account/user';
import {organizationChooserShouldBePresented} from './account/prompt-predicates';

export async function chooseAccount(context) {
  const {octokit} = context;
  const [organizations, userDetails] = await Promise.all([getOrganizations(octokit), getUserDetails(octokit)]);
  const user = userDetails.login;

  return prompt(
    [
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
    ],
    answers => {
      context.account = user === answers.userOrOrg ? answers.userOrOrg : answers.organization;
    }
  );
}
