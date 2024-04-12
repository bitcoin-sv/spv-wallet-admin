# SPV-WALLET-ADMIN

## Table of Contents
- [What is SPV-Wallet?](#what-is-spv-wallet)
- [Installation](#installation)
- [Documentation](#documentation)
- [Code Standards](#code-standards)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

<br />

## What is SPV-Wallet?
[Read more about SPV-Wallet](https://replace-after-moving-spv-wallet)
## Documentation

For in-depth information and guidance, please refer to the [SPV Wallet Documentation](https://bsvblockchain.gitbook.io/docs).

<br />

## Installation
```shell
npm install -g yarn
yarn install
```

## Running
```shell
yarn start
```

## Documentation
<details>
<summary><strong><code>Release Deployment</code></strong></summary>
<br/>

[goreleaser](https://github.com/goreleaser/goreleaser) for easy binary or library deployment to GitHub and can be installed via: `brew install goreleaser`.

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
release                       Full production release (creates release in GitHub)
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

## Contributing
View the [contributing guidelines](.github/CONTRIBUTING.md) and follow the [code of conduct](.github/CODE_OF_CONDUCT.md).

<br/>

## Contributing
All kinds of contributions are welcome!
<br/>
To get started, take a look at [code standards](.github/CODE_STANDARDS.md).
<br/>
View the [contributing guidelines](.github/CODE_STANDARDS.md#3-contributing) and follow the [code of conduct](.github/CODE_OF_CONDUCT.md).

<br/>

## License
[![License](https://img.shields.io/github/license/bitcoin-sv/spv-wallet-admin.svg?style=flat&v=1)](LICENSE)
