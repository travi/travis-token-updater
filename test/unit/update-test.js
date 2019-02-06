import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as githubClientFactory from '../../src/github-client-factory';
import * as accountChooser from '../../src/account/choose';
import {update} from '../../src';

suite('update tokens', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(githubClientFactory, 'factory');
    sandbox.stub(accountChooser, 'choose');
    sandbox.stub(console, 'log');
  });

  teardown(() => sandbox.restore());

  test('that tokens get updated for the chosen account', async () => {
    const account = any.word();
    const listForUser = sinon.stub();
    const repoNames = any.listOf(any.word);
    const repos = repoNames.map(name => ({...any.simpleObject(), name}));
    const client = {...any.simpleObject(), repos: {...any.simpleObject(), listForUser}};
    githubClientFactory.factory.returns(client);
    accountChooser.choose.withArgs(client).resolves(account);
    listForUser.withArgs({username: account}).resolves({data: repos});

    await update();

    assert.calledWith(console.log, repoNames);      // eslint-disable-line no-console
  });
});
