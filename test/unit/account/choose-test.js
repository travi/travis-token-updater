import inquirer from 'inquirer';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as userFetcher from '../../../src/account/user';
import * as orgFetcher from '../../../src/account/organizations';
import {organizationChooserShouldBePresented} from '../../../src/account/prompt-predicates';
import {choose} from '../../../src/account/choose';

suite('account chooser', () => {
  let sandbox;
  const octokit = any.simpleObject();
  const user = any.word();
  const orgNames = any.listOf(any.string);
  const organizations = orgNames.map(name => ({...any.simpleObject(), login: name}));
  const questions = [
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
      choices: orgNames,
      when: organizationChooserShouldBePresented
    }
  ];

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(userFetcher, 'getDetails');
    sandbox.stub(orgFetcher, 'getList');
    sandbox.stub(inquirer, 'prompt');

    userFetcher.getDetails.withArgs(octokit).resolves({login: user});
    orgFetcher.getList.withArgs(octokit).resolves(organizations);
  });

  teardown(() => sandbox.restore());

  test('that the user account is returned, if chosen', async () => {
    inquirer.prompt.withArgs(questions).resolves({userOrOrg: user});

    assert.equal(await choose(octokit), user);
  });

  test('that the organization is returned, if chosen', async () => {
    const organization = any.word();
    inquirer.prompt.withArgs(questions).resolves({userOrOrg: 'organization', organization});

    assert.equal(await choose(octokit), organization);
  });
});
