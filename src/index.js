import doAsync from 'doasync';
import {safeLoad as parseYaml} from 'js-yaml';
import zip from 'lodash.zip';
import Travis from 'travis-ci';
import {factory as clientFactory} from './github-client-factory';
import {choose} from './account';
import netrc from '../third-party-wrappers/netrc';

async function doIt() {
  const octokit = clientFactory();

  const account = await choose(octokit);

  const repos = await await octokit.repos.getForUser({username: account});

  const repoNames = repos.data.map(repo => repo.name);

  const responses = await Promise.all(repoNames.map(async name => octokit.repos.getContent({
    owner: account,
    repo: name,
    path: '.travis.yml'
  }).catch(() => undefined)));

  const matches = zip(responses, repoNames)
    .filter(([response]) => Boolean(response))
    .map(([response, repoName]) => [response.data.content, repoName])
    .map(([encodedContent, repoName]) => [parseYaml(Buffer.from(encodedContent, 'base64').toString()), repoName])
    .map(([config, repoName]) => ['node_js' === config.language, repoName])
    .filter(([jsProject]) => Boolean(jsProject))
    .map(([, repoName]) => repoName);

  console.log(matches);

  const travis = new Travis({version: '2.0.0'});
  const travisAsync = doAsync(travis);
  await travisAsync.authenticate({github_token: netrc()['github.com'].login});
  const travisEndpoints = doAsync(travis.endpoints);
  const travisRepos = doAsync(travis.repos('travi'));
  const travisVars = doAsync(travis.settings.env_vars);
  // const vars = await travisVars.get().catch(err => console.log(err));

  travis.settings.env_vars.get((err, res) => {
    if (err) console.log(err)
    else console.log(res)
  })

  // console.log(vars)
}

doIt().catch(err => {
  process.exitCode = 1;
  console.error(err);
});
