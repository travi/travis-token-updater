import Listr from '../../third-party-wrappers/listr';

export default function ({octokit, account, repoNames}) {
  return new Listr(
    repoNames.map(name => ({
      title: `Fetching .travis.yml from ${name}`,
      task: () => octokit.repos.getContent({
        owner: account,
        repo: name,
        path: '.travis.yml'
      })
    })),
    {concurrent: true}
  );
}
