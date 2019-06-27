/* eslint no-param-reassign: off */
import Listr from '../../third-party-wrappers/listr';
import {fetchTravisConfigFileFactory} from './listr-tasks';

export default function ({repoNames}) {
  return new Listr(
    repoNames.map(name => ({title: `Fetching .travis.yml from ${name}`, task: fetchTravisConfigFileFactory(name)})),
    {concurrent: true}
  );
}
