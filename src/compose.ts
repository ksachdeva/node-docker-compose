import Docker from 'dockerode';
import * as _ from 'lodash';

import {validateComposeSpec} from './compose-spec-validator';
import {Network, Project} from './types';
import {getOrderedServiceList} from './utils';

export class Compose {
  private docker: Docker;
  public constructor(private readonly project: Project) {
    // validate if the spec is correct
    validateComposeSpec(project);
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

    return Promise.resolve();
  }

  public async pullImages(): Promise<void> {
    // pull them sequentially for now
    _.forEach(this.project.services, async (s) => {
      const pullStream = await this.docker.pull(s.imageName.name, {});
      await this._promisifyStream(pullStream);
    });
  }

  private async _createNetworks(): Promise<string[]> {
    // figure out which networks already exist
    // and only create the ones that do not
    const networks = await this.docker.listNetworks();
    // :( dockrode type definitions are seriously 'not good'
    const existingNw: string[] = networks.map((n) => n.Name);
    const networksToCreate: Network[] = [];

    // Note - here I am matching the network name only
    // As per the documentation network name is just a label
    // the real deal is network Id
    //
    // As long as the network driver is bridge below code is
    // valid. Once I have support for more network drivers then
    // the comparison should be for full network object and not
    // just the name

    _.forEach(this.project.networks, (n) => {
      if (!_.includes(existingNw, n.name.name)) {
        networksToCreate.push(n);
      }
    });

    // at present we create them sequentially
    const nwIds: string[] = [];
    _.forEach(networksToCreate, async (nw) => {
      console.log(`Creating network ${nw.name.name}`);
      const nwId = await this.docker.createNetwork(
          {Name: nw.name.name, Driver: nw.driver});
      nwIds.push(nwId);
    });

    return nwIds;
  }

  private _promisifyStream(stream: any) {
    return new Promise((resolve, reject) => {
      stream.on('data', (d: any) => console.log(d.toString()));
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
