import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import {zip} from 'lodash';
import * as execa from '../../../third-party-wrappers/execa';
import * as repos from '../../../src/account/repos';
import * as languageResolver from '../../../src/github/determine-language-from-config';
import {determineJsProjects, fetchTravisConfigFileFactory, listRepoNames} from '../../../src/github/listr-tasks';

suite('github listr tasks', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(repos, 'listNames');
    sandbox.stub(languageResolver, 'default');
    sandbox.stub(execa, 'default');
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
      const skip = sinon.stub();
      const task = {...any.simpleObject(), skip};
      const errorMessage = any.string();
      const getContents = sinon.stub();
      const client = {...any.simpleObject(), repos: {...any.simpleObject(), getContents}};
      getContents.rejects(new Error(errorMessage));

      await fetchTravisConfigFileFactory(repoName)({octokit: client, account}, task);

      assert.calledWith(
        skip,
        `Received the following error when fetching .travis.yml from ${repoName}: ${errorMessage}`
      );
    });
  });

  test('that only js-projects are included jsRepos in the context', () => {
    const repoNames = any.listOf(any.word);
    const jsRepos = any.listOf(any.boolean, {size: repoNames.length});
    const travisConfigs = any.objectWithKeys(repoNames, {factory: any.simpleObject});
    const reposWithJsDetails = zip(repoNames, jsRepos);
    reposWithJsDetails.forEach(([repo, isJsRepo]) => {
      languageResolver.default.withArgs(travisConfigs[repo]).returns(isJsRepo ? 'node_js' : any.word());
    });
    const context = {...any.simpleObject(), travisConfigs};

    determineJsProjects(context);

    assert.deepEqual(
      context.jsProjects,
      reposWithJsDetails.map(([repo, isJsRepo]) => isJsRepo && repo).filter(Boolean)
    );
  });
});
