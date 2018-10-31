import {NetworkSpec} from './compose-spec';
import {NetworkDriverType} from './network-driver-type';
import {NetworkName} from './network-name';

export class Network {
  public readonly driver: NetworkDriverType = 'bridge';
  public constructor(readonly name: NetworkName, networkSpec: NetworkSpec) {
    if (networkSpec.driver !== undefined) {
      this.driver = networkSpec.driver;
    }
  }
}
