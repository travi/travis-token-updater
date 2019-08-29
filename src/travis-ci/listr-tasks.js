/* eslint no-param-reassign: off */
import execa from '../../third-party-wrappers/execa';
import {getRepository} from './client-wrapper';

export function getActiveChecker(travisClient, travisInstance, account, repositoryName) {
  return async (context, task) => {
    const {active} = await getRepository(travisClient, account, repositoryName);

    if (active) {
      task.title = `${repositoryName} is active on travis-ci.${travisInstance}`;
    } else {
      task.skip(`${repositoryName} is not active on travis-ci.${travisInstance}`);
    }
    context[travisInstance] = active;
  };
}

export function getTokenSetter(tokenName, tokenValue, account, repoName, outerTask) {
  return async ({com}) => execa(
    'travis',
    ['env', 'set', tokenName, tokenValue, '--repo', `${account}/${repoName}`, ...com ? ['--pro'] : []]
  ).then(() => {
    outerTask.title = `Set ${tokenName} for ${account}/${repoName} on travis-ci.${com ? 'com' : 'org'}`;
  });
}
