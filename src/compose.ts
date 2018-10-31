import Docker from 'dockerode';
import * as _ from 'lodash';

import {Container} from './container';
import {ContainerName, Network, Project} from './types';
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
    await this.pullImages();

    // create the networks for the project
    await this._createNetworks();
  }

  public async pullImages(): Promise<void> {
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
    const [available, notAvailable] =
        await Container.findAvailable(this.docker, toQuery as ContainerName[]);
    // kill the ones that are running
    await Container.kill(this.docker, available);
  }

  private async _createNetworks(): Promise<string[]> {
    const existingNetworks = await Network.list(this.docker);
    const networksToCreate = _.differenceWith(
        this.project.networks, existingNetworks, (nw1, nw2) => {
          return nw1.isEqual(nw2);
        });

    return await Promise.all(
        networksToCreate.map((nw) => nw.create(this.docker)));
  }

  private _promisifyStream(stream: any) {
    return new Promise((resolve, reject) => {
      stream.on('data', (d: any) => console.log(d.toString()));
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
