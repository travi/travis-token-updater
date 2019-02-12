import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as listInquirer from '../../third-party-wrappers/listr-inquirer';
import {chooseAccount} from '../../src/listr-tasks';
import * as userFetcher from '../../src/account/user';
import * as orgFetcher from '../../src/account/organizations';
import {organizationChooserShouldBePresented} from '../../src/account/prompt-predicates';

suite('coordination Listr tasks', () => {
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
    sandbox.stub(listInquirer, 'default');

    userFetcher.getDetails.withArgs(octokit).resolves({login: user});
    orgFetcher.getList.withArgs(octokit).resolves(organizations);
  });

  teardown(() => sandbox.restore());

  test('that the user account is returned, if chosen', async () => {
    const context = {...any.simpleObject(), octokit};
    listInquirer.default.withArgs(questions).yields({userOrOrg: user});

    await chooseAccount(context);

    assert.equal(context.account, user);
  });

  test('that the organization is returned, if chosen', async () => {
    const organization = any.word();
    const context = {...any.simpleObject(), octokit};
    listInquirer.default.withArgs(questions).yields({userOrOrg: 'organization', organization});

    await chooseAccount(context);

    assert.equal(context.account, organization);
  });
});
