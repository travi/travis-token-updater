import Listr from '../../third-party-wrappers/listr';
import {getActiveChecker, getTokenSetter} from './listr-tasks';

export default function (tokenName, tokenValue, account, repository, travisClient, proTravisClient) {
  return (_, outerTask) => new Listr(
    [
      ...!repository.private ? [{
        title: `Determining if ${repository.name} is active on travis-ci.org`,
        task: getActiveChecker(travisClient, 'org', account, repository.name)
      }] : [],
      {
        title: `Determining if ${repository.name} is active on travis-ci.com`,
        task: getActiveChecker(proTravisClient, 'com', account, repository.name)
      },
      {
        title: `Setting ${tokenName} for ${repository.name}`,
        task: getTokenSetter(tokenName, tokenValue, account, repository.name, outerTask)
      }
    ],
    {concurrent: false}
  );
}
