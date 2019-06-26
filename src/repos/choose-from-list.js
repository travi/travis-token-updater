import {prompt} from 'inquirer';

export default async function (repos) {
  const answers = await prompt([{
    type: 'checkbox',
    choices: repos,
    name: 'repos',
    message: 'Which repositories should have the token updated?'
  }]);

  return answers.repos;
}
