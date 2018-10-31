import {Network} from '../../src/network';
import {NetworkSpec} from '../../src/types/compose-spec';
import {NetworkName} from '../../src/types/network-name';

describe('types/network', () => {
  it('basic-parse-test', () => {
    const networkSpec: NetworkSpec = {driver: 'bridge'};

    const network = new Network(new NetworkName('anetwork'), networkSpec);

    // basic asserts
    expect(network.name.name).toEqual('anetwork');
    expect(network.driver).toBeDefined();
    expect(network.driver).toEqual('bridge');
  });
});
