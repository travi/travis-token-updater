import {assert} from 'chai';
import any from '@travi/any';
import {expandDetailsFromNames} from '../../src/repos-expander';

suite('repos expander', () => {
  test('that the list of names is expanded to a list of matching repository details', () => {
    const chosenRepoNames = any.listOf(any.word);
    const chosenRepos = chosenRepoNames.map(name => ({...any.simpleObject(), name}));
    const repos = [...any.listOf(any.simpleObject), ...chosenRepos];

    const expandedRepoDetails = expandDetailsFromNames(chosenRepoNames, repos);

    assert.deepEqual(expandedRepoDetails, chosenRepos);
  });
});
