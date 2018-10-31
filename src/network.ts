import Docker from 'dockerode';
import winston from 'winston';

import {NetworkDriverType} from './types/alias';
import {NetworkSpec} from './types/compose-spec';
import {NetworkName} from './types/network-name';

export class Network {
  public static async list(dc: Docker): Promise<Network[]> {
    const networks = await dc.listNetworks();
    return networks.map((nw) => Network._buildFromNetworkInfo(nw));
  }

  private static _buildFromNetworkInfo(nw: any): Network {
    const nwName = new NetworkName(nw.Name);
    const network = new Network(nwName, {driver: nw.Driver});
    network._networkId = nw.Id;
    return network;
  }

  public readonly driver: NetworkDriverType = 'bridge';
  private _networkId: string|undefined;

  public get networkId() {
    return this._networkId;
  }

  public constructor(readonly name: NetworkName, networkSpec: NetworkSpec) {
    if (networkSpec.driver !== undefined) {
      this.driver = networkSpec.driver;
    }
  }

  public async create(dc: Docker): Promise<void> {
    console.log(`Creating network ${this.name} ...`);
    // MUTATION - bad design !
    this._networkId =
        (await dc.createNetwork({Name: this.name.name, Driver: this.driver}))
            .id;
  }

  public async connect(dc: Docker, container: Docker.Container) {
    winston.info(
        `Connecting container ${container.id} to network ${this.name} ..`);
    await dc.getNetwork(this._networkId as string).connect({
      Container: container.id
    });
  }

  public isEqual(nw: Network) {
    // Note - here I am matching the network name only
    // As per the documentation network name is just a label
    // the real deal is network Id
    //
    // As long as the network driver is bridge below code is
    // valid. Once I have support for more network drivers then
    // the comparison should be for full network object and not
    // just the name
    return this.name.isEqual(nw.name) && this.driver === nw.driver;
  }
}
