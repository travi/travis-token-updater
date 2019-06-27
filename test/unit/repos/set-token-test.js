import inquirer from 'inquirer';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import {zip} from 'lodash';
import * as listr from '../../../third-party-wrappers/listr';
import * as listrTaskImplementations from '../../../src/repos/listr-tasks';
import setToken from '../../../src/repos/set-token';

suite('set token', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(listr, 'default');
    sandbox.stub(listrTaskImplementations, 'setToken');
  });

  teardown(() => sandbox.restore());

  test('that the token is set for each repository', async () => {
    const tokenName = any.word();
    const tokenValue = any.word();
    const repos = any.listOf(any.word);
    const account = any.word();
    const listrPromise = any.simpleObject();
    const run = sinon.stub();
    const setTokenFunctions = any.listOf(() => () => undefined, {size: repos.length});
    const repoTaskFunctions = zip(repos, setTokenFunctions);
    const taskDefinitions = repoTaskFunctions.map(([repoName, setTokenFunction]) => {
      listrTaskImplementations.setToken.withArgs(tokenName, tokenValue, account, repoName).returns(setTokenFunction);
      return {title: `Setting ${tokenName} for ${repoName}`, task: setTokenFunction};
    });
    listr.default.withArgs(taskDefinitions, {concurrent: true}).returns({run});
    run.returns(listrPromise);
    inquirer.prompt
      .withArgs([
        {
          type: 'input',
          name: 'tokenName',
          message: 'What is the token that should be updated?'
        },
        {
          type: 'password',
          name: 'tokenValue',
          message: 'What is the token value?'
        }
      ])
      .resolves({tokenName, tokenValue});

    const promise = await setToken(repos, account);

    assert.calledWithNew(listr.default);
    assert.equal(promise, listrPromise);
  });
});
