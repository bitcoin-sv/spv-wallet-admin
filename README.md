# BUX: Console
> Administrative dashboard to manage your Bux server

[![last commit](https://img.shields.io/github/last-commit/BuxOrg/bux-console.svg?style=flat)](https://github.com/BuxOrg/bux-console/commits/master)
[![version](https://img.shields.io/github/release-pre/BuxOrg/bux-console.svg?style=flat)](https://github.com/BuxOrg/bux-console/releases)
[![license](https://img.shields.io/badge/license-Open%20BSV-brightgreen.svg?style=flat)](/LICENSE)
[![app health](https://img.shields.io/website-up-down-green-red/https/getbux.io.svg?label=status&v=1)](https://getbux.io)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/BuxOrg/bux-console&style=flat&v=3)](https://mergify.io)
[![Sponsor](https://img.shields.io/badge/sponsor-BuxOrg-181717.svg?logo=github&style=flat&v=1)](https://github.com/sponsors/BuxOrg)

## Table of Contents
- [Installation](#installation)
- [Documentation](#documentation)
- [Code Standards](#code-standards)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

<br />

### What is BUX?
[Read more about BUX](https://getbux.io)

<br />

## Installation
(TODO)

<br />

## Documentation
(TODO)

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
audit                         Checks for vulnerabilities in dependencies
aws-param-certificate         Returns the ssm location for the domain ssl certificate id
aws-param-zone                Returns the ssm location for the host zone id
build                         Builds the package for web distribution
clean                         Remove previous builds and any test cache data
create-env-key                Creates a new key in KMS for a new stage
create-secret                 Creates an secret into AWS SecretsManager
decrypt                       Decrypts data using a KMY Key ID (awscli v2)
decrypt-deprecated            Decrypts data using a KMY Key ID (awscli v1)
deploy                        Build, prepare and deploy
encrypt                       Encrypts data using a KMY Key ID (awscli v2)
env-key-location              Returns the environment encryption key location
firebase-deploy-simple        Deploys to firebase with limited flags
firebase-get-env              Gets the current environment variables in the associated project
firebase-param-app-id         Returns the location of the app_id parameter in SSM
firebase-param-location       Creates a parameter location (for Firebase details in SSM)
firebase-param-project        Returns the location of the project-id parameter in SSM
firebase-param-sender-id      Returns the location of the sender_id parameter in SSM
firebase-save-project         Saves the firebase project information for use by CloudFormation
firebase-set-env              Set an environment variable in a firebase project
firebase-update               Update the firebase tools
help                          Show this help message
install                       Installs the dependencies for the package
invalidate-cache              Invalidates a cloudfront cache based on path
lint                          Runs the standard-js lint tool
outdated                      Checks for outdated packages via npm
package                       Process the CF template and prepare for deployment
release                       Full production release (creates release in Github)
release-snap                  Test the full release (build binaries)
release-test                  Full production test release (everything except deploy)
replace-version               Replaces the version in HTML/JS (pre-deploy)
save-domain-info              Saves the zone id and the ssl id for use by CloudFormation
save-param                    Saves a plain-text string parameter in SSM
save-param-encrypted          Saves an encrypted string value as a parameter in SSM
save-secrets                  Helper for saving sensitive credentials to Secrets Manager
start                         Start the documentation site
tag                           Generate a new tag and push (tag version=0.0.0)
tag-remove                    Remove a tag if found (tag-remove version=0.0.0)
tag-update                    Update an existing tag to current commit (tag-update version=0.0.0)
teardown                      Deletes the entire stack
test                          Runs all tests
update-secret                 Updates an existing secret in AWS SecretsManager
upload-files                  Upload/puts files into S3 bucket
```
</details>

<br />

## Code Standards
Please read our [standards document](.github/CODE_STANDARDS.md)

<br />

## Usage
Here's the [getting started](https://getbux.io) with BUX

<br />

## Maintainers
| [<img src="https://github.com/mrz1836.png" height="50" alt="MrZ" />](https://github.com/mrz1836) |
|:------------------------------------------------------------------------------------------------:|
|                                [MrZ](https://github.com/mrz1836)                                 |

<br />

## Contributing
Open source tools that we used in this project:
(TODO)

<br />

## License
[![License](https://img.shields.io/badge/license-Open%20BSV-brightgreen.svg?style=flat)](/LICENSE)
