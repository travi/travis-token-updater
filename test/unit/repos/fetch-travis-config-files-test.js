import {zip} from 'lodash';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as listr from '../../../third-party-wrappers/listr';
import * as listrTaskImplementations from '../../../src/repos/listr-tasks';
import fetchTravisConfigsFor from '../../../src/repos/fetch-travis-config-files';

suite('travis config files fetcher', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
    sandbox.stub(listrTaskImplementations, 'fetchTravisConfigFileFactory');
  });

  teardown(() => sandbox.restore());

  test('that the config files are fetched for each repo', () => {
    const repoNames = any.listOf(any.word);
    const configFileFetchFunctions = any.listOf(() => () => undefined, {size: repoNames.length});
    const listrTasks = any.simpleObject();
    const repoTaskFunctions = zip(repoNames, configFileFetchFunctions);
    const taskDefinitions = repoTaskFunctions.map(([repoName, configFileFetchFunction]) => {
      listrTaskImplementations.fetchTravisConfigFileFactory.withArgs(repoName).returns(configFileFetchFunction);
      return {title: `Fetching .travis.yml from ${repoName}`, task: configFileFetchFunction};
    });
    listr.default.withArgs(taskDefinitions, {concurrent: true}).returns(listrTasks);

    const tasks = fetchTravisConfigsFor({repoNames});

    assert.calledWithNew(listr.default);
    assert.equal(tasks, listrTasks);
  });
});
