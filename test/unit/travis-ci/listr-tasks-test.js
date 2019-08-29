import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as execa from '../../../third-party-wrappers/execa';
import * as clientWrapper from '../../../src/travis-ci/client-wrapper';
import {getActiveChecker, getTokenSetter} from '../../../src/travis-ci/listr-tasks';

suite('travis-ci listr tasks', () => {
  let sandbox;
  const tokenName = any.word();
  const tokenValue = any.string();
  const repoName = any.word();
  const account = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(execa, 'default');
    sandbox.stub(clientWrapper, 'getRepository');
  });

  teardown(() => sandbox.restore());

  suite('determine if active', () => {
    test('that the an active project reports as successful for the .org instance', async () => {
      const travisClient = any.simpleObject();
      const active = true;
      const context = any.simpleObject();
      const task = any.simpleObject();
      const repositoryDetails = {...any.simpleObject(), active};
      clientWrapper.getRepository.withArgs(travisClient, account, repoName).resolves(repositoryDetails);

      await getActiveChecker(travisClient, 'org', account, repoName)(context, task);

      assert.equal(context.org, active);
      assert.equal(task.title, `${repoName} is active on travis-ci.org`);
    });

    test('that the an inactive project reports as skipped for the .org instance', async () => {
      const travisClient = any.simpleObject();
      const active = false;
      const context = any.simpleObject();
      const skip = sinon.spy();
      const task = {...any.simpleObject(), skip};
      const repositoryDetails = {...any.simpleObject(), active};
      clientWrapper.getRepository.withArgs(travisClient, account, repoName).resolves(repositoryDetails);

      await getActiveChecker(travisClient, 'org', account, repoName)(context, task);

      assert.equal(context.org, active);
      assert.calledWith(skip, `${repoName} is not active on travis-ci.org`);
    });

    test('that the an active project reports as successful for the .com instance', async () => {
      const travisClient = any.simpleObject();
      const active = true;
      const context = any.simpleObject();
      const task = any.simpleObject();
      const repositoryDetails = {...any.simpleObject(), active};
      clientWrapper.getRepository.withArgs(travisClient, account, repoName).resolves(repositoryDetails);

      await getActiveChecker(travisClient, 'com', account, repoName)(context, task);

      assert.equal(context.com, active);
      assert.equal(task.title, `${repoName} is active on travis-ci.com`);
    });

    test('that the an inactive project reports as skipped for the .com instance', async () => {
      const travisClient = any.simpleObject();
      const active = false;
      const context = any.simpleObject();
      const skip = sinon.spy();
      const task = {...any.simpleObject(), skip};
      const repositoryDetails = {...any.simpleObject(), active};
      clientWrapper.getRepository.withArgs(travisClient, account, repoName).resolves(repositoryDetails);

      await getActiveChecker(travisClient, 'com', account, repoName)(context, task);

      assert.equal(context.com, active);
      assert.calledWith(skip, `${repoName} is not active on travis-ci.com`);
    });
  });

  suite('set token', () => {
    test('that the token is set through the cli for a .org project', async () => {
      const task = any.simpleObject();
      const outerTask = any.simpleObject();
      execa.default.resolves();

      await getTokenSetter(tokenName, tokenValue, account, repoName, outerTask)({}, task);

      assert.equal(outerTask.title, `Set ${tokenName} for ${account}/${repoName} on travis-ci.org`);
      assert.calledWith(
        execa.default,
        'travis',
        ['env', 'set', tokenName, tokenValue, '--repo', `${account}/${repoName}`]
      );
    });

    test('that the token is set through the cli for a .com project', async () => {
      const task = any.simpleObject();
      const outerTask = any.simpleObject();
      execa.default.resolves();

      await getTokenSetter(tokenName, tokenValue, account, repoName, outerTask)({com: true}, task);

      assert.equal(outerTask.title, `Set ${tokenName} for ${account}/${repoName} on travis-ci.com`);
      assert.calledWith(
        execa.default,
        'travis',
        ['env', 'set', tokenName, tokenValue, '--repo', `${account}/${repoName}`, '--pro']
      );
    });
  });
});
