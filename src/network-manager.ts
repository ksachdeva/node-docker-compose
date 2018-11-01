import Docker, {NetworkInspectInfo} from 'dockerode';
import * as _ from 'lodash';
import {ServiceDefinition} from 'service';
import winston from 'winston';

import {NetworkDefinition} from './types/network';

export class NetworkManager {
  public static async create(
      dc: Docker, networksToCreate: NetworkDefinition[],
      existingNetworks: NetworkInspectInfo[]): Promise<NetworkInspectInfo[]> {
    const nc: NetworkDefinition[] = [];

    _.forEach(networksToCreate, (n) => {
      // check if already present
      const flist = _.filter(existingNetworks, (e) => (n.name.name === e.Name));
      if (flist.length === 0) {
        nc.push(n);
      }
    });

    // finally create the ones and return the updated list
    const result: NetworkInspectInfo[] = [];

    for (const n of nc) {
      // dockrode instead of returning the network info
      // returns Docker.Network and does not even cache
      // result
      winston.info(`Creating network ${n.name} ..`);
      const dn: Docker.Network =
          await dc.createNetwork({Name: n.name.name, Driver: n.driver});

      // hence unfortunately we will have to do inspect on it one more time
      const inspectionInfo: NetworkInspectInfo = await dn.inspect();

      result.push(inspectionInfo);
    }

    result.push(...existingNetworks);

    return result;
  }

  public static connect(network: Docker.Network, container: Docker.Container) {
    winston.info(
        `Connecting container ${container.id} to network ${network.id} ..`);
    return network.connect({Container: container.id});
  }

  public static list(dc: Docker): Promise<Docker.NetworkInspectInfo[]> {
    return dc.listNetworks();
  }

  public static async attachNetworks(
      dc: Docker, service: ServiceDefinition, container: Docker.Container,
      networks: NetworkInspectInfo[]) {
    const nwsToConnectTo: NetworkInspectInfo[] = [];
    if (service.networks.length === 0) {
      // we connect it to the first network ? ... does not seem correct
      // TODO: investigate what rules docker-compose is following here !
      nwsToConnectTo.push(networks[0]);
    } else {
      service.networks.forEach((n) => {
        const relevantNws = _.filter(networks, (nw) => n.isEqual(nw.Name));
        nwsToConnectTo.push(...relevantNws);
      });
    }

    // now we connect our container to these networks
    for (const nw of nwsToConnectTo) {
      winston.info(`Connection ${nw.Name} to ${container.id} ...`);
      await NetworkManager.connect(dc.getNetwork(nw.Id), container);
    }
  }
}
