import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as octokit from '../../../third-party-wrappers/octokit';
import {factory} from '../../../src/github/client-factory';

suite('github client factory', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(octokit, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the client is authenticated using the token from netrc', () => {
    const token = any.string();
    const authenticate = sinon.spy();
    const instance = {authenticate};
    octokit.default.withArgs({auth: `token ${token}`}).returns(instance);

    assert.equal(factory(token), instance);
    assert.calledWithNew(octokit.default);
  });
});
