import {Project} from '../../src/project';
import {ComposeSpec, NetworkSpec, ServiceSpec} from '../../src/types/compose-spec';
import {getOrderedServiceList} from '../../src/utils';

describe('utils', () => {
  it('Basic service dependency graph creation', () => {
    const networkSpec: NetworkSpec = {driver: 'bridge'};

    const serviceSpec1: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      networks: ['docker_elk'],
      container_name: 'elasticsearch'
    };

    const serviceSpec2: ServiceSpec = {
      image: 'docker.elastic.co/kibana/kibana:6.4.2',
      container_name: 'kibana',
      ports: ['5601:5601'],
      networks: ['docker_elk'],
      depends_on: ['service1']
    };

    const composeSpec: ComposeSpec = {
      version: '2.0',
      networks: {docker_elk: networkSpec},
      services: {service2: serviceSpec2, service1: serviceSpec1}
    };

    const project =
        new Project({projectName: 'test', composeSpec, pull: false});
    const orderedServices = getOrderedServiceList(project.services);

    expect(orderedServices).toHaveLength(2);
    expect(orderedServices[0].name.name).toEqual('service1');
    expect(orderedServices[1].name.name).toEqual('service2');
  });
});
