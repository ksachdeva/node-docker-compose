import {NetworkDriverType} from './types/alias';
import {NetworkSpec} from './types/compose-spec';
import {NetworkName} from './types/network-name';

export class Network {
  public readonly driver: NetworkDriverType = 'bridge';
  public constructor(readonly name: NetworkName, networkSpec: NetworkSpec) {
    if (networkSpec.driver !== undefined) {
      this.driver = networkSpec.driver;
    }
  }
}
