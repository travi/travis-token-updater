import Octokit from '../third-party-wrappers/octokit';

export function factory(githubAccessToken) {
  return new Octokit({auth: `token ${githubAccessToken}`});
}
