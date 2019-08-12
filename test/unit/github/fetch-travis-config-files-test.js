import {zip} from 'lodash';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as listr from '../../../third-party-wrappers/listr';
import * as listrTaskImplementations from '../../../src/github/listr-tasks';
import fetchTravisConfigsFor from '../../../src/github/fetch-travis-config-files';

suite('travis config files fetcher', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
    sandbox.stub(listrTaskImplementations, 'fetchTravisConfigFileFactory');
  });

  teardown(() => sandbox.restore());

  test('that the config files are fetched for each repo', () => {
    const repos = any.listOf(() => ({name: any.word()}));
    const configFileFetchFunctions = any.listOf(() => () => undefined, {size: repos.length});
    const listrTasks = any.simpleObject();
    const repoTaskFunctions = zip(repos, configFileFetchFunctions);
    const taskDefinitions = repoTaskFunctions.map(([repo, configFileFetchFunction]) => {
      listrTaskImplementations.fetchTravisConfigFileFactory.withArgs(repo.name).returns(configFileFetchFunction);
      return {title: `Fetching .travis.yml from ${repo.name}`, task: configFileFetchFunction};
    });
    listr.default.withArgs(taskDefinitions, {concurrent: true}).returns(listrTasks);

    const tasks = fetchTravisConfigsFor({repos});

    assert.calledWithNew(listr.default);
    assert.equal(tasks, listrTasks);
  });
});
