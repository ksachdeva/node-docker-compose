# Docker Compose API for NodeJS

**Note - This is work under progress and at present compliance with any of the docker-compose version is not implemented**

## Motivation

**Why node-docker-compose when there is a python version ?**

The short answer is that I have a (private) project written using Typescript that needed to orchestrate docker containers. Initially I tried to invoke the docker-compose (python app) using child-process however the error handling and progress was a mess.

You may now ask you do not really need docker-compose to orchestrate, just use dockrode to do it. It is true however I still needed a spec for what needs to be run and instead of re-inventing yet another input specification I decided to use docker-compose.yaml syntax.

That said, at present I am only implementing the constructs that I need for my private project and will slowly add the support for many other aspects of docker-compose. If you think the project has merits please feel free to contribute.
