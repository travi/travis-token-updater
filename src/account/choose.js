import {prompt} from 'inquirer';
import Listr from 'listr';
import {getDetails as getUserDetails} from './user';
import {getList as getOrganizations} from './organizations';
import {organizationChooserShouldBePresented} from './prompt-predicates';

export async function choose(octokit) {
  const tasks = new Listr([
    {
      title: 'Fetch Organizations',
      task: ctx => getOrganizations(octokit).then(organizations => {
        ctx.organizations = organizations;
      })
    },
    {
      title: 'Fetch User Account',
      task: ctx => getUserDetails(octokit).then(user => {
        ctx.user = user;
      })
    }
  ], {concurrent: true});

  const {organizations, user: userDetails} = await tasks.run();
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
