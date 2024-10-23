# Running Playwright Tests

> **Note:** We run visual tests inside docker container because we need to have screenshots from linux

## Introduction

This guide explains how to run visual tests in Playwright using npm scripts. The scripts we will cover are:

- `test:visual`: runs visual tests.
- `test:visual:update`: updates existing snapshots.

## Setting Up the Environment

Ensure you have docker

## Docker files

```
/app
├── /playwright
│   ├── Dockerfile
│   └── docker-compose.yml
└── ...
```

## Run tests

```
yarn tests:visual
```

## Update image snapshots

```
yarn tests:visual:update
```
