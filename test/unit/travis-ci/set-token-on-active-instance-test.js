import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as listr from '../../../third-party-wrappers/listr';
import * as listrTaskImplementations from '../../../src/travis-ci/listr-tasks';
import getActiveInstanceTokenSetter from '../../../src/travis-ci/set-token-on-active-instance';

suite('set token on active instance', () => {
  let sandbox;
  const tokenName = any.word();
  const tokenValue = any.word();
  const account = any.word();
  const travisClient = any.simpleObject();
  const proTravisClient = any.simpleObject();
  const outerTask = any.simpleObject();
  const listrTasks = any.simpleObject();
  const proActiveChecker = () => undefined;
  const setToken = () => undefined;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
    sandbox.stub(listrTaskImplementations, 'getTokenSetter');
    sandbox.stub(listrTaskImplementations, 'getActiveChecker');
  });

  teardown(() => sandbox.restore());

  test('that .com and .org are checked to determine which is active', () => {
    const activeChecker = () => undefined;
    const repository = {...any.simpleObject(), name: any.word(), private: false};
    listrTaskImplementations.getTokenSetter
      .withArgs(tokenName, tokenValue, account, repository.name, outerTask)
      .returns(setToken);
    listrTaskImplementations.getActiveChecker
      .withArgs(travisClient, 'org', account, repository.name)
      .returns(activeChecker);
    listrTaskImplementations.getActiveChecker
      .withArgs(proTravisClient, 'com', account, repository.name)
      .returns(proActiveChecker);
    listr.default
      .withArgs(
        [
          {title: `Determining if ${repository.name} is active on travis-ci.org`, task: activeChecker},
          {title: `Determining if ${repository.name} is active on travis-ci.com`, task: proActiveChecker},
          {title: `Setting ${tokenName} for ${repository.name}`, task: setToken}
        ],
        {concurrent: false}
      )
      .returns(listrTasks);

    const tasks = getActiveInstanceTokenSetter(
      tokenName,
      tokenValue,
      account,
      repository,
      travisClient,
      proTravisClient
    )(null, outerTask);

    assert.calledWithNew(listr.default);
    assert.equal(tasks, listrTasks);
  });

  test('that .org is not checked for private projects', () => {
    const repository = {...any.simpleObject(), name: any.word(), private: true};
    listrTaskImplementations.getTokenSetter
      .withArgs(tokenName, tokenValue, account, repository.name, outerTask)
      .returns(setToken);
    listrTaskImplementations.getActiveChecker
      .withArgs(proTravisClient, 'com', account, repository.name)
      .returns(proActiveChecker);
    listr.default
      .withArgs(
        [
          {title: `Determining if ${repository.name} is active on travis-ci.com`, task: proActiveChecker},
          {title: `Setting ${tokenName} for ${repository.name}`, task: setToken}
        ],
        {concurrent: false}
      )
      .returns(listrTasks);

    const tasks = getActiveInstanceTokenSetter(
      tokenName,
      tokenValue,
      account,
      repository,
      travisClient,
      proTravisClient
    )(null, outerTask);

    assert.equal(tasks, listrTasks);
  });
});
