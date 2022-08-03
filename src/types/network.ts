import { NetworkDriverType } from './alias';
import { NetworkSpec } from './compose-spec';
import { NetworkName } from './network-name';

export class NetworkDefinition {
  public readonly driver: NetworkDriverType = 'bridge';
  public constructor(readonly name: NetworkName, networkSpec: NetworkSpec) {
    if (networkSpec.driver !== undefined) {
      this.driver = networkSpec.driver;
    }
  }

  public isEqual(nw: NetworkDefinition) {
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
