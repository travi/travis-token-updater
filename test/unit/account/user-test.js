import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {getDetails} from '../../../src/account/user';

suite('fetch current user', () => {
  test('that user details are fetched for the authenticated session', async () => {
    const get = sinon.stub();
    const user = any.simpleObject();
    get.resolves({data: user});

    assert.equal(await getDetails({users: {get}}), user);
  });
});
