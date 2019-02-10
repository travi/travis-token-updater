import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as repos from '../../../src/account/repos';
import {listRepoNames, fetchTravisConfigFileFactory} from '../../../src/repos/listr-tasks';

suite('Listr tasks for listing the projects', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(repos, 'listNames');
  });

  teardown(() => sandbox.restore());

  test('that the list of projects is determined for the account', async () => {
    const client = any.simpleObject();
    const account = any.word();
    const context = {...any.simpleObject(), octokit: client, account};
    const repoNames = any.listOf(any.word);
    repos.listNames.withArgs(client, account).resolves(repoNames);

    await listRepoNames(context);

    assert.equal(context.repoNames, repoNames);
  });

  suite('Travis-CI config file', () => {
    test('that the file is fetched', async () => {
      const repoName = any.word();
      const account = any.word();
      const config = any.simpleObject();
      const response = {...any.simpleObject(), data: {...any.simpleObject(), content: config}};
      const task = any.simpleObject();
      const travisConfigs = any.simpleObject();
      const getContents = sinon.stub();
      const client = {...any.simpleObject(), repos: {...any.simpleObject(), getContents}};
      getContents.withArgs({owner: account, repo: repoName, path: '.travis.yml'}).resolves(response);

      await fetchTravisConfigFileFactory(repoName)({octokit: client, account, travisConfigs}, task);

      assert.equal(travisConfigs[repoName], config);
      assert.equal(task.title, `Fetched .travis.yml from ${repoName}`);
    });

    test('that failure to find the file does not result in failure', async () => {
      const repoName = any.word();
      const account = any.word();
      const task = any.simpleObject();
      const errorMessage = any.string();
      const getContents = sinon.stub();
      const client = {...any.simpleObject(), repos: {...any.simpleObject(), getContents}};
      getContents.rejects(new Error(errorMessage));

      await fetchTravisConfigFileFactory(repoName)({octokit: client, account}, task);

      assert.equal(
        task.title,
        `Received the following error when fetching .travis.yml from ${repoName}: ${errorMessage}`
      );
    });
  });
});
