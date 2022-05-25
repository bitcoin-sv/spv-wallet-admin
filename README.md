# BUX: Console
> Administrative dashboard to manage your [BUX](https://getbux.io) Server

[![last commit](https://img.shields.io/github/last-commit/BuxOrg/bux-console.svg?style=flat)](https://github.com/BuxOrg/bux-console/commits/master)
[![version](https://img.shields.io/github/release-pre/BuxOrg/bux-console.svg?style=flat)](https://github.com/BuxOrg/bux-console/releases)
[![app health](https://img.shields.io/website-up-down-green-red/https/getbux.io.svg?label=status&v=1)](https://getbux.io)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/BuxOrg/bux-console&style=flat&v=3)](https://mergify.io)
[![Sponsor](https://img.shields.io/badge/sponsor-BuxOrg-181717.svg?logo=github&style=flat&v=1)](https://github.com/sponsors/BuxOrg)

## Table of Contents
- [What is BUX?](#what-is-bux)
- [Installation](#installation)
- [Documentation](#documentation)
- [Code Standards](#code-standards)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

<br />

## What is BUX?
[Read more about BUX](https://getbux.io)

<br />

## Installation
```shell
npm install -g meteor
meteor npm install -g yarn
```

## Running
```shell
./start.sh
```

## Documentation
View more [BUX documentation](https://getbux.io)

<details>
<summary><strong><code>Release Deployment</code></strong></summary>
<br/>

[goreleaser](https://github.com/goreleaser/goreleaser) for easy binary or library deployment to Github and can be installed via: `brew install goreleaser`.

The [.goreleaser.yml](.goreleaser.yml) file is used to configure [goreleaser](https://github.com/goreleaser/goreleaser).

Use `make release-snap` to create a snapshot version of the release, and finally `make release` to ship to production.
</details>

<details>
<summary><strong><code>Makefile Commands</code></strong></summary>
<br/>

View all `makefile` commands
```shell script
make help
```

List of all current commands:
```text
audit                         Checks for any packages that are vulnerable
clean                         Remove previous builds and any test cache data
help                          Show this help message
install                       Install the application
install-all-contributors      Installs all contributors locally
outdated                      Checks for any outdated packages
release                       Full production release (creates release in Github)
release-snap                  Test the full release (build binaries)
release-test                  Full production test release (everything except deploy)
replace-version               Replaces the version in HTML/JS (pre-deploy)
start                         Starts the console
tag                           Generate a new tag and push (tag version=0.0.0)
tag-remove                    Remove a tag if found (tag-remove version=0.0.0)
tag-update                    Update an existing tag to current commit (tag-update version=0.0.0)
update-contributors           Regenerates the contributors html/list
```
</details>

<br />

## Code Standards
Please read our [standards document](.github/CODE_STANDARDS.md)

<br />

## Usage
Here's the [getting started](https://getbux.io) with BUX

<br />


## Contributing
View the [contributing guidelines](.github/CONTRIBUTING.md) and follow the [code of conduct](.github/CODE_OF_CONDUCT.md).

<br/>

### How can I help?
All kinds of contributions are welcome :raised_hands:!
The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:.
You can also support this project by [becoming a sponsor on GitHub](https://github.com/sponsors/BuxOrg) :clap:
or by making a [**bitcoin donation**](https://getbux.io/#sponsor?utm_source=github&utm_medium=sponsor-link&utm_campaign=bux-console&utm_term=bux-console&utm_content=bux-console) to ensure this journey continues indefinitely! :rocket:

[![Stars](https://img.shields.io/github/stars/BuxOrg/bux-console?label=Please%20like%20us&style=social&v=2)](https://github.com/BuxOrg/bux-console/stargazers)

<br/>

### Contributors ✨
Thank you to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/icellan"><img src="https://avatars.githubusercontent.com/u/4411176?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Siggi</b></sub></a><br /><a href="#infra-icellan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/BuxOrg/bux-console/commits?author=icellan" title="Code">💻</a> <a href="#security-icellan" title="Security">🛡️</a></td>
    <td align="center"><a href="https://mrz1818.com"><img src="https://avatars.githubusercontent.com/u/3743002?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mr. Z</b></sub></a><br /><a href="#infra-mrz1836" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/BuxOrg/bux-console/commits?author=mrz1836" title="Code">💻</a> <a href="#maintenance-mrz1836" title="Maintenance">🚧</a> <a href="#business-mrz1836" title="Business development">💼</a></td>
    <td align="center"><a href="https://github.com/galt-tr"><img src="https://avatars.githubusercontent.com/u/64976002?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dylan</b></sub></a><br /><a href="https://github.com/BuxOrg/bux-console/commits?author=galt-tr" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

> This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.

<br />

## License
[![License](https://img.shields.io/github/license/BuxOrg/bux-console.svg?style=flat&v=1)](LICENSE)
