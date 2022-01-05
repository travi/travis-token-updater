import {StatusCodes} from 'http-status-codes';
import {After, Before, Given} from '@cucumber/cucumber';
import nock from 'nock';
import any from '@travi/any';

let apiScope;

const debug = require('debug')('nock-github-api');

Before(function () {
  apiScope = nock('https://api.github.com').persist().log(debug);

  this.githubAccessToken = any.string();
});

Given('the repository is {word}', async function () {
  apiScope
    .matchHeader('Authorization', `token ${this.githubAccessToken}`)
    .get('/user')
    .reply(StatusCodes.OK, {
      login: any.word()
    });
  apiScope
    .matchHeader('Authorization', `token ${this.githubAccessToken}`)
    .get('/user/orgs')
    .reply(StatusCodes.OK, [{
      login: any.word()
    }]);
});

After(function () {
  apiScope = {};
});
