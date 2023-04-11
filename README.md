# nRF.guide

[![GitHub Actions](https://github.com/bifravst/nrf.guide/actions/workflows/build-and-publish.yaml/badge.svg)](https://github.com/bifravst/nrf.guide/actions/workflows/build-and-publish.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

A getting started guide for the Nordic Semiconductor Development Kits.

## Setup

Install the dependencies:

```bash
npm ci
```

## Run

```bash
npm start
```

### Running the tests

You can run the tests using

```bash
npm run test:e2e
```

## Deploy

- register domain name, export as `DOMAIN_NAME`
- create certificate in `us-east-1` region, export as `CERTIFICATE_ID`
- export a comma-separated list of allowed client addresses as
  `ALLOWED_CLIENTS`. This list may contain host names (e.g. from a DDNS
  provider) which will be resolved.

```bash
npx cdk bootstrap
npx cdk deploy --all
```

## Continuous Deployment with GitHub Actions

<!-- FIXME: use environments once repo is public -->

Store the registry endpoint as a GitHub Action variable:

```bash
gh variable set REGISTRY_ENDPOINT --body "<registry endpoint>"
```

Store the role used for continuous deployment as a secret:

```bash
CD_ROLE_ARN=`aws cloudformation describe-stacks --stack-name ${STACK_NAME:-nrf-guide-web} | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "gitHubCdRoleArn") | .OutputValue' | sed -E 's/\/$//g'`
gh secret set AWS_ROLE --body "${CD_ROLE_ARN}"
```

Store the stack name and the region as a variable:

```bash
gh variable set STACK_NAME --body "${STACK_NAME:-nrf-guide-web}"
gh variable set AWS_REGION --body "eu-north-1"
```
