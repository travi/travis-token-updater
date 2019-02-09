/* eslint no-param-reassign: off */
import Listr from '../../third-party-wrappers/listr';

export default function ({repoNames}) {
  return new Listr(
    repoNames.map(name => ({
      title: `Fetching .travis.yml from ${name}`,
      task: ({octokit, account}, task) => octokit.repos.getContents({
        owner: account,
        repo: name,
        path: '.travis.yml'
      }).then(result => {
        task.title = `Fetched .travis.yml from ${name}`;

        return result;
      }).catch(err => {
        task.title = `Received the following error when fetching .travis.yml from ${name}: ${err.message}`;
      })
    })),
    {concurrent: true}
  );
}
