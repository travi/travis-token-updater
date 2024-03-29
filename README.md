# travis-token-updater

tool for rolling tokens for multiple projects across an account

<!--status-badges start -->

[![Codecov][coverage-badge]][coverage-link]
[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]

<!--status-badges end -->

## Table of Contents

* [Purpose](#purpose)
* [Usage](#usage)
  * [Installation](#installation)
  * [Authentication](#authentication)
  * [Example](#example)
    * [Dependencies:](#dependencies)
* [Contributing](#contributing)
  * [Dependencies](#dependencies-1)
  * [Verification](#verification)

## Purpose

This tool will scan your GitHub account's repositories for JavaScript projects
and make it simple to update the value of the `NPM_TOKEN` or `GH_TOKEN`
encrypted environment variable on Travis CI for each project.

This is especially useful for an `NPM_TOKEN` that is CIDR restricted to work
only on valid Travis CI servers. This restriction depends on the public IP
addresses of those servers, which do change occasionally. When the list changes,
a [new token with the proper IPs must be created](https://gist.github.com/travi/f91c73610fa49769d90e3ee3b66cfbee)
and used instead of the previous token that now has an outdated list of IPs.

:warning: This package provides only the programmatic API that enables rolling
the tokens on Travis CI, but is expected to be run interactively. You are
expected to provide [your own CLI wrapper](#example).

## Usage

<!--consumer-badges start -->

[![npm][npm-badge]][npm-link]
[![MIT license][license-badge]][license-link]

<!--consumer-badges end -->

### Installation

```sh
$ npm install travis-token-updater
```

### Authentication

A GitHub [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)
is needed to interaction the the GitHub and Travis CI APIs.

Add a [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)
to your [`~/.netrc` file](https://ec.haxx.se/usingcurl-netrc.html)

    machine github.com
      login <personal access token here>

### Example

#### Dependencies:

```javascript
import yargs from 'yargs';
import {update as updateTravisTokens} from 'travis-token-updater';
```

#### Register with the framework of your choise (yargs is used here)

```javascript
yargs
  .scriptName('form8ion-utils')
  .usage('Usage: $0 <cmd> [args]')
  .command(
    'travis-tokens',
    'Roll token for Travis projects throughout the organization',
    () => updateTravisTokens({githubAccount: '<your github account here (optionally)>'})
  )
  .help('h')
  .alias('h', 'help')
  .argv;
```

## Contributing

<!--contribution-badges start -->

[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![PRs Welcome][PRs-badge]][PRs-link]
[![Greenkeeper badge](https://badges.greenkeeper.io/travi/travis-token-updater.svg)](https://greenkeeper.io/)

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[npm-link]: https://www.npmjs.com/package/travis-token-updater

[npm-badge]: https://img.shields.io/npm/v/travis-token-updater.svg

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/travi/travis-token-updater.svg

[coverage-link]: https://codecov.io/github/travi/travis-token-updater

[coverage-badge]: https://img.shields.io/codecov/c/github/travi/travis-token-updater.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[github-actions-ci-link]: https://github.com/travi/travis-token-updater/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://github.com/travi/travis-token-updater/workflows/Node.js%20CI/badge.svg
