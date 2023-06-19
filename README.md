# `hello.nrfcloud.com`

[![GitHub Actions](https://github.com/hello-nrfcloud/web/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/hello-nrfcloud/web/actions/workflows/test-and-release.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Retrieve real-time data from your Nordic Semiconductor Development Kits within
seconds.

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

```bash
npx cdk bootstrap
npx cdk deploy --all
```

## Create map resources

```bash
npx cdk deploy -a 'npx tsx cdk/map.ts'
```

Store the `mapName` and `identityPoolId` in the parameter registry.

## Continuous Deployment with GitHub Actions

Create a GitHub environment `production`.

<!-- FIXME: add CLI comment -->

Store the registry endpoint as a GitHub Action variable:

```bash
gh variable set REGISTRY_ENDPOINT --env production --body "<registry endpoint>"
# If using a custom domain name
gh variable set DOMAIN_NAME --env production --body "<domain name>"
```

Store the role used for continuous deployment as a secret:

```bash
CD_ROLE_ARN=`aws cloudformation describe-stacks --stack-name ${STACK_NAME:-hello-nrfcloud-web} | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "gitHubCdRoleArn") | .OutputValue'`
gh secret set AWS_ROLE --env production --body "${CD_ROLE_ARN}"
```

Store the stack name and the region as a variable:

```bash
gh variable set STACK_NAME --env production --body "${STACK_NAME:-hello-nrfcloud-web}"
gh variable set AWS_REGION --env production --body "eu-central-1"
```
