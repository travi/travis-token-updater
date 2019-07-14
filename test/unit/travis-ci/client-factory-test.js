import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as travisCi from '../../../third-party-wrappers/travis-ci';
import generateClient from '../../../src/travis-ci/client-factory';

suite('travis-ci client factory', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(travisCi, 'default');
  });

  teardown(() => sandbox.restore());

  test('that a client is created and gets authenticated', () => {
    const createdClient = any.simpleObject();
    travisCi.default.withArgs({version: '2.0.0'}).returns(createdClient);

    const client = generateClient();

    assert.equal(client, createdClient);
    assert.calledWithNew(travisCi.default);
  });

  test('that a client is created for the pro instance and gets authenticated', () => {
    const createdClient = any.simpleObject();
    travisCi.default.withArgs({version: '2.0.0', pro: true}).returns(createdClient);

    const client = generateClient(true);

    assert.equal(client, createdClient);
    assert.calledWithNew(travisCi.default);
  });
});
