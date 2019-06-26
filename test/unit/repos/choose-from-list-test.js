import inquirer from 'inquirer';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import chooseFromList from '../../../src/repos/choose-from-list';

suite('choose repositories from list', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(inquirer, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the user is allowed to choose repositories from the list', async () => {
    const repos = any.listOf(any.word);
    const chosenRepos = any.listOf(any.word);
    inquirer.prompt
      .withArgs([{
        type: 'checkbox',
        choices: repos,
        name: 'repos',
        message: 'Which repositories should have the token updated?'
      }])
      .resolves(chosenRepos);

    assert.equal(await chooseFromList(repos), chosenRepos);
  });
});
