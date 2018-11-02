import * as _ from 'lodash';

import {ValidationError} from './errors';
import {ProjectConfig} from './project-config';
import {ComposeSpec} from './types/compose-spec';
import {ComposeVersion} from './types/compose-version';
import {NetworkDefinition} from './types/network';
import {NetworkName} from './types/network-name';
import {ServiceDefinition} from './types/service';
import {ServiceName} from './types/service-name';
import {getOrderedServiceList} from './utils';
import {convertToJSON} from './yaml-to-json';

export class Project {
  public readonly version: ComposeVersion;
  public readonly services: ServiceDefinition[];
  public readonly networks: NetworkDefinition[];

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

    // finally perform the validation
    this._validateComposeSpec();

    // get the ordered list
    this.services = getOrderedServiceList(this.services);
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
        const network =
            new NetworkDefinition(networkName, composeSpec.networks[key]);
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
      const network = new NetworkDefinition(networkName, {driver: 'bridge'});
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
      const service = new ServiceDefinition(
          serviceName, composeSpec.services[key], this.config.projectName);

      this.services.push(service);
    }
  }

  private _validateNetworksInServices() {
    // purpose of this validator is to ensure that Services contains only
    // those networks that have been specified in the project
    const networkNames = this.networks.map((n) => n.name.name);

    _.forEach(this.services, (s) => _.forEach(s.networks, (n) => {
      const result = _.includes(networkNames, n.name);
      if (!result) {
        throw new ValidationError(
            `Service "${s.name}" contains an undefined network - "${n}"`);
      }
    }));
  }

  private _validateServiceDependencyExists() {
    // purpose of this validator to ensure that if depends_on is specified
    // then its value is that of a service that indeed exists
    const serviceNames = this.services.map((s) => s.name.name);

    _.forEach(this.services, (s) => _.forEach(s.dependsOn, (d) => {
      const result = _.includes(serviceNames, d.name);
      if (!result) {
        throw new ValidationError(
            `Service "${s.name}" contains an undefined dependency - "${d}"`);
      }
    }));
  }

  private _validateComposeSpec() {
    this._validateNetworksInServices();
    this._validateServiceDependencyExists();
  }
}
