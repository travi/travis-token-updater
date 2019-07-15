import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as execa from '../../../third-party-wrappers/execa';
import {getTokenSetter} from '../../../src/travis-ci/listr-tasks';

suite('travis-ci listr tasks', () => {
  let sandbox;
  const tokenName = any.word();
  const tokenValue = any.string();
  const repoName = any.word();
  const account = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(execa, 'default');
  });

  teardown(() => sandbox.restore());

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

    await getTokenSetter(tokenName, tokenValue, account, repoName, outerTask)({pro: true}, task);

    assert.equal(outerTask.title, `Set ${tokenName} for ${account}/${repoName} on travis-ci.com`);
    assert.calledWith(
      execa.default,
      'travis',
      ['env', 'set', tokenName, tokenValue, '--repo', `${account}/${repoName}`, '--pro']
    );
  });
});
