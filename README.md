# Docker Compose API for NodeJS

**Note - This is work under progress and *at present* compliance with any of the docker-compose schema version is not targeted**

## Motivation

**Why node-docker-compose when there is a python version ?**

The short answer is that I have a (private) project written using Typescript that needed to orchestrate docker containers. Initially I tried to invoke the docker-compose (python app) using child-process however the error handling and progress monitoring was not to my satisfaction (read -> it was a mess and I hated it !).

You may now suggest - `Just use dockrode to do it`. Your suggestion is valid to some extent, however my application still required a spec (an input file) for what needs to be created (i.e. images, volumes, networks) and run (i.e. containers). Therefore, instead of re-inventing yet another input specification I decided to re-use docker-compose.yaml syntax.

That said, at present I am only implementing the constructs/features that I need for my private project and will slowly add the support for other aspects of docker-compose to reach a level of compliance with few (if not all) docker-compose schema versions.

If you think the project has merits please feel free to contribute !
