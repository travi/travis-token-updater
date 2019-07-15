/* eslint no-param-reassign: off */
import execa from '../../third-party-wrappers/execa';

export function getTokenSetter(tokenName, tokenValue, account, repoName, outerTask) {
  return async ({pro}) => execa(
    'travis',
    ['env', 'set', tokenName, tokenValue, '--repo', `${account}/${repoName}`, ...pro ? ['--pro'] : []]
  ).then(() => {
    outerTask.title = `Set ${tokenName} for ${account}/${repoName} on travis-ci.${pro ? 'com' : 'org'}`;
  });
}
