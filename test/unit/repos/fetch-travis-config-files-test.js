import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as listr from '../../../third-party-wrappers/listr';
import fetchTravisConfigsFor from '../../../src/repos/fetch-travis-config-files';

suite('travis config files fetcher', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(listr, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the config files are fetched for each repo', () => {
    const getContent = sinon.stub();
    const client = {...any.simpleObject(), repos: {...any.simpleObject(), getContent}};
    const account = any.word();
    const repoNames = any.listOf(any.word);
    const listrTasks = any.simpleObject();
    listr.default.returns(listrTasks);

    const tasks = fetchTravisConfigsFor({octokit: client, account, repoNames});

    assert.calledWithNew(listr.default);
    assert.equal(tasks, listrTasks);

    const callToListrConstructor = listr.default.getCall(0);
    assert.deepEqual(callToListrConstructor.args[1], {concurrent: true});
    repoNames.forEach(async (name, index) => {
      const taskDefinition = callToListrConstructor.args[0][index];
      const config = any.simpleObject();
      getContent.withArgs({owner: account, repo: name, path: '.travis.yml'}).resolves(config);

      assert.equal(taskDefinition.title, `Fetching .travis.yml from ${name}`);
      assert.equal(await taskDefinition.task(), config);
    });
  });
});
