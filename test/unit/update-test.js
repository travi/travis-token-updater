import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as githubClientFactory from '../../src/github-client-factory';
import * as accountChooser from '../../src/account/choose';
import * as repos from '../../src/account/repos';
import {update} from '../../src';

suite('update tokens', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(githubClientFactory, 'factory');
    sandbox.stub(accountChooser, 'choose');
    sandbox.stub(repos, 'listNames');
    sandbox.stub(console, 'log');
  });

  teardown(() => sandbox.restore());

  test('that tokens get updated for the chosen account', async () => {
    const account = any.word();
    const repoNames = any.listOf(any.word);
    const client = any.simpleObject();
    githubClientFactory.factory.returns(client);
    accountChooser.choose.withArgs(client).resolves(account);
    repos.listNames.withArgs(client, account).returns(repoNames);

    await update();

    assert.calledWith(console.log, repoNames);      // eslint-disable-line no-console
  });
});
