/* eslint no-param-reassign: off */
import Listr from '../../third-party-wrappers/listr';
import {fetchTravisConfigFileFactory} from './listr-tasks';

export default function ({repos}) {
  return new Listr(
    repos.map(({name}) => ({title: `Fetching .travis.yml from ${name}`, task: fetchTravisConfigFileFactory(name)})),
    {concurrent: true}
  );
}
