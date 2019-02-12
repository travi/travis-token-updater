import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as listr from '../../../third-party-wrappers/listr';
import * as repos from '../../../src/account/repos';
import filter from '../../../src/repos/determine-js-projects';
import fetchTravisConfigFiles from '../../../src/repos/fetch-travis-config-files';
import {determineJsProjects, listRepoNames} from '../../../src/repos/listr-tasks';

suite('js projects from repos', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
    sandbox.stub(repos, 'listNames');
  });

  teardown(() => sandbox.restore());

  test('that the account repos list is filtered to js projects', async () => {
    const client = any.simpleObject();
    const account = any.word();
    const repoNames = any.listOf(any.word);
    const listrPromise = any.simpleObject();
    const run = sinon.stub();
    run.withArgs({account, octokit: client, travisConfigs: {}}).returns(listrPromise);
    listr.default
      .withArgs([
        {title: `Determining list of repositories for ${account}`, task: listRepoNames},
        {title: 'Fetching Travis-CI config files for each repository', task: fetchTravisConfigFiles},
        {title: 'Filtering to JavaScript projects', task: determineJsProjects}
      ])
      .returns({run});
    repos.listNames.withArgs(client, account).resolves(repoNames);

    const promise = filter(client, account);

    assert.calledWithNew(listr.default);
    assert.equal(promise, listrPromise);
  });
});
