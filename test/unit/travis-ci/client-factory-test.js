import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as travisCi from '../../../third-party-wrappers/travis-ci';
import generateClient from '../../../src/travis-ci/client-factory';

suite('travis-ci client factory', () => {
  let sandbox;
  const githubToken = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(travisCi, 'default');
  });

  teardown(() => sandbox.restore());

  test('that a client is created and gets authenticated', async () => {
    const authenticate = sinon.stub();
    const createdClient = {...any.simpleObject(), authenticate};
    travisCi.default.withArgs({version: '2.0.0'}).returns(createdClient);
    authenticate.yields();

    const client = await generateClient(githubToken);

    assert.equal(client, createdClient);
    assert.calledWithNew(travisCi.default);
    assert.calledWith(authenticate, {github_token: githubToken});
  });

  test('that a client is created for the pro instance and gets authenticated', async () => {
    const authenticate = sinon.stub();
    const createdClient = {...any.simpleObject(), authenticate};
    travisCi.default.withArgs({version: '2.0.0', pro: true}).returns(createdClient);
    authenticate.yields();

    const client = await generateClient(githubToken, true);

    assert.equal(client, createdClient);
    assert.calledWithNew(travisCi.default);
    assert.calledWith(authenticate, {github_token: githubToken});
  });

  test('that the error is thrown if authentication fails', () => {
    const message = any.string();
    const error = new Error(message);
    const authenticate = sinon.stub();
    const createdClient = {...any.simpleObject(), authenticate};
    travisCi.default.withArgs({version: '2.0.0'}).returns(createdClient);
    authenticate.yields(error);

    return assert.isRejected(generateClient(githubToken), error, message);
  });
});
