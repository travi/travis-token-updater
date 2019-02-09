import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as repos from '../../../src/account/repos';
import {listRepoNames} from '../../../src/repos/listr-tasks';

suite('Listr tasks for listing the projects', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(repos, 'listNames');
  });

  teardown(() => sandbox.restore());

  test('that the list of projects is determined for the account', async () => {
    const client = any.simpleObject();
    const account = any.word();
    const context = {...any.simpleObject(), octokit: client, account};
    const repoNames = any.listOf(any.word);
    repos.listNames.withArgs(client, account).resolves(repoNames);

    await listRepoNames(context);

    assert.equal(context.repoNames, repoNames);
  });
});
