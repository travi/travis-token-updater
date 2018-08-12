import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {getList} from '../../../src/account/organizations';

suite('fetch organizations', () => {
  test('that the list of orgs is fetched for the authenticated session', async () => {
    const getOrgs = sinon.stub();
    const organizations = any.listOf(any.simpleObject);
    getOrgs.resolves({data: organizations});

    assert.equal(await getList({users: {getOrgs}}), organizations);
  });
});
