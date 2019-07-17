import inquirer from 'inquirer';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import {zip} from 'lodash';
import * as listr from '../../../third-party-wrappers/listr';
import * as listrTaskImplementations from '../../../src/travis-ci/set-token-on-active-instance';
import {requireTokenValue} from '../../../src/prompt-validations';
import setToken from '../../../src/travis-ci/set-token';

suite('set token', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(inquirer, 'prompt');
    sandbox.stub(listr, 'default');
    sandbox.stub(listrTaskImplementations, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the token is set for each repository', async () => {
    const tokenName = any.word();
    const tokenValue = any.word();
    const repos = any.listOf(any.word);
    const account = any.word();
    const listrPromise = any.simpleObject();
    const travisClient = any.simpleObject();
    const proTravisClient = any.simpleObject();
    const run = sinon.stub();
    const setTokenFunctions = any.listOf(() => () => undefined, {size: repos.length});
    const repoTaskFunctions = zip(repos, setTokenFunctions);
    const taskDefinitions = repoTaskFunctions.map(([repoName, setTokenFunction]) => {
      listrTaskImplementations.default
        .withArgs(tokenName, tokenValue, account, repoName, travisClient, proTravisClient)
        .returns(setTokenFunction);
      return {title: `Setting ${tokenName} for ${repoName}`, task: setTokenFunction};
    });
    listr.default.withArgs(taskDefinitions, {concurrent: true}).returns({run});
    run.returns(listrPromise);
    inquirer.prompt
      .withArgs([
        {
          type: 'list',
          name: 'tokenName',
          choices: ['NPM_TOKEN', 'GH_TOKEN'],
          message: 'What is the token that should be updated?'
        },
        {
          type: 'password',
          name: 'tokenValue',
          message: 'What is the token value?',
          validate: requireTokenValue
        }
      ])
      .resolves({tokenName, tokenValue});

    const promise = await setToken(repos, account, travisClient, proTravisClient);

    assert.calledWithNew(listr.default);
    assert.equal(promise, listrPromise);
  });
});
