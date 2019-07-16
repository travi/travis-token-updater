export function getRepository(travisClient, account, repositoryName) {
  return new Promise((resolve, reject) => {
    travisClient.repos(account, repositoryName).get((err, response) => {
      if (err) reject(err);
      else resolve(response.repo);
    });
  });
}
