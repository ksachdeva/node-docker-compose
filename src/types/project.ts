import {ValidationError} from '../errors';
import {convertToJSON} from '../yaml-to-json';
import {ComposeSpec} from './compose-spec';
import {ComposeVersion} from './compose-version';
import {Network} from './network';
import {NetworkName} from './network-name';
import {ProjectConfig} from './project-config';
import {Service} from './service';
import {ServiceName} from './service-name';

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
