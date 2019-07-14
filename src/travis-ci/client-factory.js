import Travis from '../../third-party-wrappers/travis-ci';

export default function (pro) {
  return new Travis({version: '2.0.0', ...pro && {pro}});
}
