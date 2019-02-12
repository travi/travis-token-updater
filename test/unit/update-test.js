import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as listr from '../../third-party-wrappers/listr';
import * as githubClientFactory from '../../src/github-client-factory';
import listJavaScriptRepoNames from '../../src/repos/determine-js-projects';
import {chooseAccount} from '../../src/listr-tasks';
import {update} from '../../src';

suite('update tokens', () => {
  let sandbox;
  const error = new Error(any.simpleObject());

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
    sandbox.stub(githubClientFactory, 'factory');
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  });

  teardown(() => {
    sandbox.restore();
    process.exitCode = 0;
  });

  test('that tokens get updated for the chosen account', async () => {
    const jsProjects = any.listOf(any.word);
    const client = any.simpleObject();
    const run = sinon.stub();
    run.withArgs({octokit: client, travisConfigs: {}}).resolves({jsProjects});
    githubClientFactory.factory.returns(client);
    listr.default
      .withArgs([
        {title: 'Determining account', task: chooseAccount},
        {title: 'Finding JavaScript Projects', task: listJavaScriptRepoNames}
      ])
      .returns({run});

    await update();

    assert.calledWithNew(listr.default);
    assert.calledWith(console.log, {jsProjects});   // eslint-disable-line no-console
  });

  test('that errors are written to stderr', async () => {
    const run = sinon.stub();
    listr.default.returns({run});
    run.rejects(error);

    await update();

    assert.calledWith(console.error, error);        // eslint-disable-line no-console
    assert.equal(process.exitCode, 1);
  });
});
