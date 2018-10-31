import Docker from 'dockerode';
import * as _ from 'lodash';

import {Container} from './container';
import {Service} from './service';
import {ContainerName, Network, NetworkName, Project} from './types';
import {getOrderedServiceList} from './utils';

export class Compose {
  private docker: Docker;
  public constructor(private readonly project: Project) {
    this.docker = new Docker({socketPath: '/var/run/docker.sock'});
  }

  public async up(): Promise<void> {
    // get the ordered list
    const services = getOrderedServiceList(this.project.services);

    // pull the images first before modifying/changing anything
    // this way even if there are failures there is no n/w creation
    // at this point of time
    await this.pull();

    // create the networks for the project
    await this._createNetworks();

    // create the containers in sequence
    services.forEach(async (s) => {
      const container = await Container.create(this.docker, s);

      // attach the desired network with this container
      // if a service does not have a network specified then
      // we attach it to the project network else we find the network to attach
      // to
      await this._attachNetworks(s, container);

      // start the container
      await Container.start(this.docker, container);
    });
  }

  public async down(): Promise<void> {
    // this one brings down the project
  }

  public async pull(): Promise<void> {
    // pull them sequentially for now
    _.forEach(this.project.services, async (s) => {
      const pullStream = await this.docker.pull(s.imageName.name, {});
      await this._promisifyStream(pullStream);
    });
  }

  public async kill(): Promise<void> {
    const toQuery = this.project.services.map((s) => s.containerName);
    // TODO: at present I am assuming that container names are specified
    // in the compose file

    // get the containers that are available
    const [available, notAvailable] = await Container.findAvailable(
        this.docker, toQuery as ContainerName[], false);
    // kill the ones that are running
    await Container.kill(this.docker, available);
  }

  public async remove(force: boolean, removeVolumes: boolean): Promise<void> {
    const toQuery = this.project.services.map((s) => s.containerName);

    // get the containers that are available
    const [available, notAvailable] = await Container.findAvailable(
        this.docker, toQuery as ContainerName[], true);

    // remove the available containers
    await Container.remove(this.docker, available, force, removeVolumes);
  }

  private async _createNetworks(): Promise<void> {
    const existingNetworks = await Network.list(this.docker);
    const networksToCreate = _.differenceWith(
        this.project.networks, existingNetworks, (nw1, nw2) => {
          return nw1.isEqual(nw2);
        });

    await Promise.all(networksToCreate.map((nw) => nw.create(this.docker)));
  }

  private async _attachNetworks(service: Service, container: Docker.Container) {
    const nwsToConnectTo: Network[] = [];
    if (service.networks.length === 0) {
      // we connect it to the first network ? ... does not seem correct
      // TODO: investigate what rules docker-compose is following here !
      nwsToConnectTo.push(this.project.networks[0]);
    } else {
      service.networks.forEach((n) => {
        const relevantNws =
            _.filter(this.project.networks, (nw) => n.isEqual(nw.name));
        nwsToConnectTo.push(...relevantNws);
      });
    }

    // now connect each network one by one to the provided
    // container
    nwsToConnectTo.forEach(
        async (nw) => await nw.connect(this.docker, container));
  }

  private _promisifyStream(stream: any) {
    return new Promise((resolve, reject) => {
      stream.on('data', (d: any) => console.log(d.toString()));
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
