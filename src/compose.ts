import Docker from 'dockerode';
import * as _ from 'lodash';
import {Logger} from 'winston';

import {Container} from './container';
import {buildLogger} from './logger';
import {NetworkManager} from './network-manager';
import {Project} from './project';
import {ContainerName} from './types';

export class Compose {
  private docker: Docker;
  private logger: Logger;
  public constructor(private readonly project: Project) {
    this.docker = new Docker({socketPath: '/var/run/docker.sock'});
    this.logger = buildLogger('info');
  }

  public async up(authConfig?: Docker.AuthConfig[]): Promise<void> {
    // pull the images first before modifying/changing anything
    // this way even if there are failures there is no n/w creation
    // at this point of time
    this.logger.debug('Pulling the images ..');
    await this.pull(authConfig);

    // get the list of existing networks
    this.logger.debug('List the existing networks ..');
    let existingNetworks = await NetworkManager.list(this.docker);

    // create the networks for the project
    this.logger.debug('Create the networks that do not exist ..');
    existingNetworks = await NetworkManager.create(
        this.docker, this.project.networks, existingNetworks);

    const networksForDefinition: Docker.NetworkInspectInfo[] = [];
    _.forEach(this.project.networks, (n) => {
      const flist = _.filter(existingNetworks, (e) => (n.name.name === e.Name));
      networksForDefinition.push(...flist);
    });

    // create the containers in sequence
    for (let i = 0; i < this.project.services.length; i++) {
      const s = this.project.services[i];
      this.logger.debug('Create the container ..');
      const container = await Container.create(this.docker, s, (i + 1));

      // attach the desired network with this container
      // if a service does not have a network specified then
      // we attach it to the project network else we find the network to attach
      // to
      this.logger.debug('Attaching networks ..');
      await NetworkManager.attachNetworks(
          this.docker, s, container, networksForDefinition);

      // finally start the container
      this.logger.debug('Start the container ..');
      await Container.start(this.docker, container);
    }
  }

  public async down(): Promise<void> {
    // stop the containers
    // create and remove containers in sequence
    this.logger.debug('Stopping all containers ..');
    await this.remove(true, true);

    // remove the networks
    // How do we know that the network belongs to this particular docker-compose
    // project ?
  }

  public async pull(authConfig?: Docker.AuthConfig[]): Promise<void> {
    // pull them sequentially for now
    for (const s of this.project.services) {
      // The authentication config is to be specified
      // per service image

      let authconfig;
      if (authConfig && authConfig.length > 0) {
        // see if there is one that starts with our repo name
        authconfig = _.find(
            authConfig,
            (c: Docker.AuthConfig) =>
                s.imageName.name.startsWith(c.serveraddress));
      }

      const pullStream = await this.docker.pull(s.imageName.name, {authconfig});
      await this._promisifyStream(pullStream);
    }
  }

  public async kill(): Promise<void> {
    // we need to reverse the order of services
    const services = _.reverse(this.project.services);

    const toQuery = services.map((s) => s.containerName);
    // TODO: at present I am assuming that container names are specified
    // in the compose file

    // get the containers that are available
    const [available, notAvailable] = await Container.findAvailable(
        this.docker, toQuery as ContainerName[], false);
    // kill the ones that are running
    await Container.kill(this.docker, available);
  }

  public async remove(force: boolean, removeVolumes: boolean): Promise<void> {
    // we need to reverse the order of services
    const services = _.reverse(this.project.services);

    const toQuery = services.map((s) => s.containerName);

    // get the containers that are available
    const [available, notAvailable] = await Container.findAvailable(
        this.docker, toQuery as ContainerName[], true);

    // remove the available containers
    await Container.remove(this.docker, available, force, removeVolumes);
  }

  private _promisifyStream(stream: any) {
    return new Promise((resolve, reject) => {
      stream.on(
          'data',
          (d: any) => {
              // this.logger.debug(d.toString());
          });
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
