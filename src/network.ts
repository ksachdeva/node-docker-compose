import Docker from 'dockerode';

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
    return new Network(nwName, {driver: nw.Driver});
  }

  public readonly driver: NetworkDriverType = 'bridge';

  public constructor(readonly name: NetworkName, networkSpec: NetworkSpec) {
    if (networkSpec.driver !== undefined) {
      this.driver = networkSpec.driver;
    }
  }

  public create(dc: Docker): Promise<string> {
    console.log(`Creating network ${this.name} ...`);
    return dc.createNetwork({Name: this.name.name, Driver: this.driver});
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
