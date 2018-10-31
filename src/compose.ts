import Docker from 'dockerode';
import * as _ from 'lodash';

import {validateComposeSpec} from './compose-spec-validator';
import {Project} from './types';
import {getOrderedServiceList} from './utils';

export class Compose {
  private docker: Docker;
  public constructor(private readonly project: Project) {
    // validate if the spec is correct
    validateComposeSpec(project);
    this.docker = new Docker({ socketPath : '/var/run/docker.sock' });
  }

  public async up(): Promise<void> {
    // get the ordered list
    const services = getOrderedServiceList(this.project.services);
    return Promise.resolve();
  }

  public async pullImages(): Promise<void> {
    // pull them sequentially for now
    _.forEach(this.project.services, async (s) => {
      const pullStream = await this.docker.pull(s.imageName.name, {});
      await this._promisifyStream(pullStream);
    });
  }

  private _promisifyStream(stream: any) {
    return new Promise((resolve, reject) => {
      stream.on('data', (d: any) => console.log(d.toString()));
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
