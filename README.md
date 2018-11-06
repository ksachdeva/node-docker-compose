# Docker Compose API for NodeJS

**Note - This is work under progress and *at present* compliance with any of the docker-compose schema version is not targeted**

## Motivation

**Why node-docker-compose when there is a python version ?**

The short answer is that I have a (private) project written using Typescript that needed to orchestrate docker containers. Initially I tried to invoke the docker-compose (python app) using child-process however the error handling and progress monitoring was not to my satisfaction (read -> it was a mess and I hated it !).

You may now suggest - `Just use dockrode to do it`. Your suggestion is valid to some extent, however my application still required a spec (an input file) for what needs to be created (i.e. images, volumes, networks) and run (i.e. containers). Therefore, instead of re-inventing yet another input specification I decided to re-use docker-compose.yaml syntax.

That said, at present I am only implementing the constructs/features that I need for my private project and will slowly add the support for other aspects of docker-compose to reach a level of compliance with few (if not all) docker-compose schema versions.

If you think the project has merits please feel free to contribute !

## Installation

```bash
npm install node-docker-compose
```

## Quick Start

```ts
import {Compose, Project} from 'node-docker-compose';

// Tip: use dotenv to read the environment variables
// and merge them in environmentVariables
const environmentVariables = { MY_ENV_VAR1 : 'value' };

// Create the project by passing the project config
const project = new Project({
    pull : true,    // Note - At present no impact
    composeSpec : composeFilePath,
    projectName : 'MyComposeProj',
    environmentVariables: environmentVariables
  });

const compose = new Compose(project);

// systematically first bring the down the project
// to remove any containers
await compose.down();

// bring up the project
await compose.up();

// if using private registry such as Google Container registry
// pass the AuthConfig
//
// in below example, it will be used for pulling images that start with 'gcr.io'
await compose.up([{
    username : 'oauth2accesstoken',
    password : gcrToken,
    serveraddress : 'gcr.io'
}]);

```

## TODO

- [ ] Support skipping creation of containers that already exist for the same project
- [ ] Callbacks to inform the progress from higher level APIs (such as up and down)
- [ ] Support to remove the networks
- [ ] Config CLI command
- [ ] Specify the list of environment files (only .env in project directory is supported for now)
- [ ] If pull is false in ProjectConfig then do not fetch the latest image (if image is already present on the system)
