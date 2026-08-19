# `hello.nrfcloud.com`

[![GitHub Actions](https://github.com/hello-nrfcloud/web/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/hello-nrfcloud/web/actions/workflows/test-and-release.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![@commitlint/config-conventional](https://img.shields.io/badge/%40commitlint-config--conventional-brightgreen)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Retrieve real-time data from your Nordic Semiconductor Development Kit within
seconds.

## Setup

Install the dependencies:

```bash
npm ci
```

## API Key for AWS Location Service map resources

### Create an API key

```bash
  aws location create-key \
    --region eu-west-1 \
    --key-name hello.nrfcloud.com \
    --description "Map tiles for the hello.nrfcloud.com web app" \
    --no-expiry \
    --restrictions '{"AllowActions":["geo-maps:GetTile","geo-maps:GetStaticMap"],"AllowResources":["arn:aws:geo-maps:eu-west-1::provide
  r/default"],"AllowReferers":["https://hello.nrfcloud.com/*","http://localhost:*/*"]}'
```

### Configure

Export the map settings as the environment variables `MAP_REGION` and
`MAP_API_KEY` before running it.

## Run

```bash
npm start
```

### Running the tests

End-to-end tests are run completely without a backend using Vite's built-in dev
server to serve the data.

> Note: It's currently not possible to run test for multiple browsers in
> parallel since the `webServer` >
> [cannot be defined per project](https://github.com/microsoft/playwright/issues/22496),
> and there is a state in the backend mock server that gets manipulated by the
> tests. So by default only the `chrome` project is run

```bash
npm run test:e2e
```

### Run the Playwright code generator

```bash
npx playwright codegen
```

### Debug individual tests

```bash
PWDEBUG=1 npx playwright test e2e-tests/
```

### Interact with the e2e backend

See [./e2e-tests/README.e2e-server.md](README.e2e-server.md)

## Deploy

- register domain name, export as `DOMAIN_NAME`
- [create certificate in `us-east-1` region](https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates/request),
  export as `CERTIFICATE_ID`

```bash
npx cdk bootstrap
npx cdk deploy --all
```

## Continuous Deployment with GitHub Actions

Create a GitHub environment `production`.

<!-- FIXME: add CLI comment -->

Store the registry endpoint as a GitHub Action variable:

```bash
gh variable set REGISTRY_ENDPOINT --env production --body "<registry endpoint>"
# If using a custom domain name
gh variable set DOMAIN_NAME --env production --body "<domain name>"
gh variable set MAP_REGION --env production --body "<mapRegion>"
gh variable set MAP_API_KEY --env production --body "<apiKey>"
```

Store the role used for continuous deployment as a secret:

```bash
CD_ROLE_ARN=`aws cloudformation describe-stacks --stack-name ${STACK_NAME:-hello-nrfcloud-web} | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "gitHubCdRoleArn") | .OutputValue'`
gh secret set AWS_ROLE --env production --body "${CD_ROLE_ARN}"
```

Store the stack name and the region as a variable:

```bash
gh variable set STACK_NAME --env production --body "${STACK_NAME:-hello-nrfcloud-web}"
gh variable set AWS_REGION --env production --body "eu-west-1"
```

## Continuous integration

Store the map settings as variables:

```bash
# Make sure that the `ci` environment exists in this repo
gh variable set MAP_REGION --env ci --body "<mapRegion>"
gh variable set MAP_API_KEY --env ci --body "<apiKey>"
```

## Node & NPM

This project requires Node.js `>=20.0.0` and npm `>=12.0.2 <13` (enforced via
`check-node-version` on `npm install` and `npm ci`).

The check is skipped during `npm publish` and `npm pack`, because
`semantic-release` bundles its own npm (`@semantic-release/npm` depends on
`npm@^11.6.2`) and runs the publish with that version rather than the one
installed in CI.
