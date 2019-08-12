import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as netrc from '../../third-party-wrappers/netrc';
import * as githubClientFactory from '../../src/github/client-factory';
import * as accountChooser from '../../src/account/choose';
import * as jsRepos from '../../src/github/determine-js-projects';
import * as chooseReposFromList from '../../src/github/choose-from-list';
import * as tokenSetter from '../../src/travis-ci/set-token';
import * as travisClientFactory from '../../src/travis-ci/client-factory';
import * as reposExpander from '../../src/repos-expander';
import {update} from '../../src';

suite('update tokens', () => {
  let sandbox;
  const error = new Error(any.simpleObject());
  const githubAccessToken = any.string();
  const githubClient = any.simpleObject();
  const travisClient = any.simpleObject();
  const proTravisClient = any.simpleObject();
  const repos = any.listOf(any.simpleObject);
  const chosenRepoNames = any.listOf(any.word);
  const chosenRepos = any.listOf(any.simpleObject);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(githubClientFactory, 'factory');
    sandbox.stub(travisClientFactory, 'default');
    sandbox.stub(accountChooser, 'choose');
    sandbox.stub(jsRepos, 'default');
    sandbox.stub(chooseReposFromList, 'default');
    sandbox.stub(tokenSetter, 'default');
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
    sandbox.stub(netrc, 'default');
    sandbox.stub(reposExpander, 'expandDetailsFromNames');

    netrc.default.returns({'github.com': {login: githubAccessToken}});
    githubClientFactory.factory.withArgs(githubAccessToken).returns(githubClient);
    travisClientFactory.default.withArgs(githubAccessToken).resolves(travisClient);
    travisClientFactory.default.withArgs(githubAccessToken, true).resolves(proTravisClient);
  });

  teardown(() => {
    sandbox.restore();
    process.exitCode = 0;
  });

  test('that tokens get updated for the chosen account', async () => {
    const account = any.word();
    const jsProjects = any.listOf(any.word);
    accountChooser.choose.withArgs(githubClient).resolves(account);
    jsRepos.default.withArgs(githubClient, account).resolves({repos, jsProjects});
    chooseReposFromList.default.withArgs(jsProjects).resolves(chosenRepoNames);
    reposExpander.expandDetailsFromNames.withArgs(chosenRepoNames, repos).returns(chosenRepos);

    await update();

    assert.calledWith(tokenSetter.default, chosenRepos, account, travisClient, proTravisClient);
  });

  test('that account choice step when explicitly defined', async () => {
    const githubAccount = any.word();
    const travisConfigs = any.simpleObject();
    const jsProjects = any.listOf(any.word);
    jsRepos.default.withArgs(githubClient, githubAccount).resolves({repos, travisConfigs, jsProjects});
    chooseReposFromList.default.withArgs(jsProjects).resolves(chosenRepoNames);
    reposExpander.expandDetailsFromNames.withArgs(chosenRepoNames, repos).returns(chosenRepos);

    await update({githubAccount});

    assert.notCalled(accountChooser.choose);
    assert.calledWith(tokenSetter.default, chosenRepos, githubAccount, travisClient, proTravisClient);
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
