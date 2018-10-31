import * as _ from 'lodash';

import {ValidationError} from './errors';
import {ProjectConfig} from './project-config';
import {ComposeSpec} from './types/compose-spec';
import {ComposeVersion} from './types/compose-version';
import {Network} from './types/network';
import {NetworkName} from './types/network-name';
import {Service} from './types/service';
import {ServiceName} from './types/service-name';
import {convertToJSON} from './yaml-to-json';

export class Project {
  public readonly version: ComposeVersion;
  public readonly services: Service[];
  public readonly networks: Network[];

  public constructor(readonly config: ProjectConfig) {
    let composeSpec: ComposeSpec;
    if (typeof (config.composeSpec) === 'string') {
      composeSpec = convertToJSON(config.composeSpec as string);
    } else {
      composeSpec = config.composeSpec as ComposeSpec;
    }

    // TODO: Add check for supported versions
    this.version = composeSpec.version;
    this.services = [];
    this.networks = [];

    this._parseNetworks(composeSpec);
    this._parseServices(composeSpec);
  }

  private _parseNetworks(composeSpec: ComposeSpec) {
    // parse the specified networks
    if (composeSpec.networks !== undefined) {
      // tslint:disable-next-line:forin
      for (const key in composeSpec.networks) {
        if (key === undefined || key === null) {
          throw new ValidationError('Network name is undefined !');
        }

        const networkName = new NetworkName(key);
        const network = new Network(networkName, composeSpec.networks[key]);
        this.networks.push(network);
      }
    } else {
      // we create a default network name which is "projectname_default"
      // now since projectname itself may be directoryname_default
      // a bit of parsing is required
      let nwName;
      if (_.endsWith(this.config.projectName, '_default')) {
        nwName = this.config.projectName;
      } else {
        nwName = this.config.projectName + '_default';
      }

      const networkName = new NetworkName(nwName);
      const network = new Network(networkName, {driver: 'bridge'});
      this.networks.push(network);
    }
  }

  private _parseServices(composeSpec: ComposeSpec) {
    // parse the specified services
    // tslint:disable-next-line:forin
    for (const key in composeSpec.services) {
      if (key === undefined || key === null) {
        throw new ValidationError('Service name is undefined !');
      }

      const serviceName = new ServiceName(key);
      const service = new Service(serviceName, composeSpec.services[key]);

      this.services.push(service);
    }
  }
}
