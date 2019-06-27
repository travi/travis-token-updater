import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {getDetails} from '../../../src/account/user';

suite('fetch current user', () => {
  test('that user details are fetched for the authenticated session', async () => {
    const getAuthenticated = sinon.stub();
    const user = any.simpleObject();
    getAuthenticated.resolves({data: user});

    assert.equal(await getDetails({users: {getAuthenticated}}), user);
  });
});
