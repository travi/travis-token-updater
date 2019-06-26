import {prompt} from 'inquirer';

export default function (repos) {
  return prompt([{
    type: 'checkbox',
    choices: repos,
    name: 'repos',
    message: 'Which repositories should have the token updated?'
  }]);
}
