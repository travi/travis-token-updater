import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as githubClientFactory from '../../src/github-client-factory';
import * as accountChooser from '../../src/account/choose';
import * as jsRepos from '../../src/repos/determine-js-projects';
import * as chooseReposFromList from '../../src/repos/choose-from-list';
import * as tokenSetter from '../../src/repos/set-token';
import {update} from '../../src';

suite('update tokens', () => {
  let sandbox;
  const error = new Error(any.simpleObject());

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(githubClientFactory, 'factory');
    sandbox.stub(accountChooser, 'choose');
    sandbox.stub(jsRepos, 'default');
    sandbox.stub(chooseReposFromList, 'default');
    sandbox.stub(tokenSetter, 'default');
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  });

  teardown(() => {
    sandbox.restore();
    process.exitCode = 0;
  });

  test('that tokens get updated for the chosen account', async () => {
    const account = any.word();
    const repoNames = any.listOf(any.word);
    const travisConfigs = any.simpleObject();
    const jsProjects = any.listOf(any.word);
    const chosenRepos = any.listOf(any.word);
    const client = any.simpleObject();
    githubClientFactory.factory.returns(client);
    accountChooser.choose.withArgs(client).resolves(account);
    jsRepos.default.withArgs(client, account).resolves({repoNames, travisConfigs, jsProjects});
    chooseReposFromList.default.withArgs(jsProjects).resolves(chosenRepos);

    await update();

    assert.calledWith(tokenSetter.default, chosenRepos, account);
  });

  test('that account choice step when explicitly defined', async () => {
    const githubAccount = any.word();
    const repoNames = any.listOf(any.word);
    const travisConfigs = any.simpleObject();
    const jsProjects = any.listOf(any.word);
    const chosenRepos = any.listOf(any.word);
    const client = any.simpleObject();
    githubClientFactory.factory.returns(client);
    jsRepos.default.withArgs(client, githubAccount).resolves({repoNames, travisConfigs, jsProjects});
    chooseReposFromList.default.withArgs(jsProjects).resolves(chosenRepos);

    await update({githubAccount});

    assert.notCalled(accountChooser.choose);
    assert.calledWith(tokenSetter.default, chosenRepos, githubAccount);
  });

  test('that an error from choosing the account is written to stderr', async () => {
    accountChooser.choose.rejects(error);

    await update();

    assert.calledWith(console.error, error);      // eslint-disable-line no-console
    assert.equal(process.exitCode, 1);
  });

  test('that an error from listing the js projects is written to stderr', async () => {
    accountChooser.choose.resolves(any.simpleObject());
    jsRepos.default.rejects(error);

    await update();

    assert.calledWith(console.error, error);      // eslint-disable-line no-console
    assert.equal(process.exitCode, 1);
  });
});
