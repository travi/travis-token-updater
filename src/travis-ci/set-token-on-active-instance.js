import Listr from '../../third-party-wrappers/listr';
import {getActiveChecker, getTokenSetter} from './listr-tasks';

export default function (tokenName, tokenValue, account, repositoryName, travisClient, proTravisClient) {
  return (_, outerTask) => new Listr(
    [
      {
        title: `Determining if ${repositoryName} is active on travis-ci.org`,
        task: getActiveChecker(travisClient, 'org', account, repositoryName)
      },
      {
        title: `Determining if ${repositoryName} is active on travis-ci.com`,
        task: getActiveChecker(proTravisClient, 'com', account, repositoryName)
      },
      {
        title: `Setting ${tokenName} for ${repositoryName}`,
        task: getTokenSetter(tokenName, tokenValue, account, repositoryName, outerTask)
      }
    ],
    {concurrent: false}
  );
}
