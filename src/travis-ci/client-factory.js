import Travis from '../../third-party-wrappers/travis-ci';

export default function (githubToken, pro) {
  return new Promise((resolve, reject) => {
    const client = new Travis({version: '2.0.0', ...pro && {pro}});

    client.authenticate({github_token: githubToken}, error => {
      if (error) reject(error);

      resolve(client);
    });
  });
}
