import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import {getRepository} from '../../../src/travis-ci/client-wrapper';

suite('travis-ci client promise wrapper', () => {
  let sandbox;
  const repoName = any.word();
  const account = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => sandbox.restore());

  test('that the repository details are retrieved from the travis api', async () => {
    const repos = sinon.stub();
    const getRepo = sinon.stub();
    const repo = any.simpleObject();
    const response = {...any.simpleObject(), repo};
    repos.withArgs(account, repoName).returns({get: getRepo});
    getRepo.yields(null, response);

    assert.equal(await getRepository({repos}, account, repoName), repo);
  });

  test('that failure to fetch the repository details rejects the promise', async () => {
    const repos = sinon.stub();
    const getRepo = sinon.stub();
    const message = any.sentence();
    const error = new Error(message);
    repos.returns({get: getRepo});
    getRepo.yields(error);

    assert.isRejected(getRepository({repos}, account, repoName), error, message);
  });
});
