import {ServiceSpec} from '../../src/types/compose-spec';
import {ServiceDefinition} from '../../src/types/service';
import {ServiceName} from '../../src/types/service-name';

describe('types/service', () => {
  it('basic-parse-test', () => {
    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      container_name: 'elasticsearch',
      networks: ['docker_elk']
    };

    const service = new ServiceDefinition(
        new ServiceName('aservice'), serviceSpec, 'testdata');

    // basic asserts
    // expect(service.containerName).toBeNull();
    expect(service.ports).toHaveLength(2);
    expect(service.networks).toHaveLength(1);

    expect(service.imageName).toBeDefined();
    expect(service.imageName.repoName.name)
        .toEqual('docker.elastic.co/elasticsearch/elasticsearch');
    expect(service.imageName.tag.name).toEqual('6.4.2');

    expect(service.networks[0].name).toEqual('docker_elk');
    expect(service.ports[0].host).toEqual(9200);
    expect(service.ports[0].container).toEqual(9201);
  });
});
