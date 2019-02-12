import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {listNames} from '../../../src/account/repos';
import * as userFetcher from '../../../src/account/user';

suite('account repos', () => {
  let sandbox;
  const account = any.word();
  const repoNames = any.listOf(any.string);
  const repos = repoNames.map(name => ({...any.simpleObject(), name}));
  const requestOptions = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(userFetcher, 'getDetails');
  });

  teardown(() => sandbox.restore());

  test('that the repo names for the user account are listed', async () => {
    const merge = sinon.stub();
    const paginate = sinon.stub();
    const client = {...any.simpleObject(), paginate, repos: {...any.simpleObject(), list: {endpoint: {merge}}}};
    userFetcher.getDetails.withArgs(client).resolves({login: account});
    merge.withArgs({}).returns(requestOptions);
    paginate.withArgs(requestOptions).resolves({data: repos});

    assert.deepEqual(await listNames(client, account), repoNames);
  });

  test('that the repo names for the user account are listed', async () => {
    const merge = sinon.stub();
    const paginate = sinon.stub();
    const client = {...any.simpleObject(), paginate, repos: {...any.simpleObject(), listForOrg: {endpoint: {merge}}}};
    userFetcher.getDetails.withArgs(client).resolves({login: any.word()});
    merge.withArgs({org: account}).returns(requestOptions);
    paginate.withArgs(requestOptions).resolves({data: repos});

    assert.deepEqual(await listNames(client, account), repoNames);
  });
});
