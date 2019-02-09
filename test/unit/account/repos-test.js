import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {listNames} from '../../../src/account/repos';

suite('account repos', () => {
  test('that the repo names for the account are listed', async () => {
    const account = any.word();
    const names = any.listOf(any.string);
    const repos = names.map(name => ({...any.simpleObject(), name}));
    const listForUser = sinon.stub();
    const client = {...any.simpleObject(), repos: {...any.simpleObject(), listForUser}};
    listForUser.withArgs({username: account}).resolves({data: repos});

    assert.deepEqual(await listNames(client, account), names);
  });
});
