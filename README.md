# nRF.guide

[![GitHub Actions](https://github.com/NordicSemiconductor/nrf.guide/actions/workflows/build-and-publish.yaml/badge.svg)](https://github.com/NordicSemiconductor/nrf.guide/actions/workflows/build-and-publish.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/NordicSemiconductor/nrf.guide)](https://mergify.io)
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
