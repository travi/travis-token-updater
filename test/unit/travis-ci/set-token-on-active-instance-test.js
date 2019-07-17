import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as listr from '../../../third-party-wrappers/listr';
import * as listrTaskImplementations from '../../../src/travis-ci/listr-tasks';
import getActiveInstanceTokenSetter from '../../../src/travis-ci/set-token-on-active-instance';

suite('set token on active instance', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
    sandbox.stub(listrTaskImplementations, 'getTokenSetter');
    sandbox.stub(listrTaskImplementations, 'getActiveChecker');
  });

  teardown(() => sandbox.restore());

  test('that .com and .org are checked to determine which is active', () => {
    const listrTasks = any.simpleObject();
    const tokenName = any.word();
    const tokenValue = any.word();
    const account = any.word();
    const repositoryName = any.word();
    const outerTask = any.simpleObject();
    const travisClient = any.simpleObject();
    const proTravisClient = any.simpleObject();
    const setToken = () => undefined;
    const activeChecker = () => undefined;
    const proActiveChecker = () => undefined;
    listrTaskImplementations.getTokenSetter
      .withArgs(tokenName, tokenValue, account, repositoryName, outerTask)
      .returns(setToken);
    listrTaskImplementations.getActiveChecker
      .withArgs(travisClient, 'org', account, repositoryName)
      .returns(activeChecker);
    listrTaskImplementations.getActiveChecker
      .withArgs(proTravisClient, 'com', account, repositoryName)
      .returns(proActiveChecker);
    listr.default
      .withArgs(
        [
          {title: `Determining if ${repositoryName} is active on travis-ci.org`, task: activeChecker},
          {title: `Determining if ${repositoryName} is active on travis-ci.com`, task: proActiveChecker},
          {title: `Setting ${tokenName} for ${repositoryName}`, task: setToken}
        ],
        {concurrent: false}
      )
      .returns(listrTasks);

    const tasks = getActiveInstanceTokenSetter(
      tokenName,
      tokenValue,
      account,
      repositoryName,
      travisClient,
      proTravisClient
    )(null, outerTask);

    assert.calledWithNew(listr.default);
    assert.equal(tasks, listrTasks);
  });
});
