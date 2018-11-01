import {Project} from '../../src/project';
import {ComposeSpec, ServiceSpec} from '../../src/types/compose-spec';

describe('project', () => {
  it('A default n/w is created if one is not specified', async () => {
    const serviceSpec1: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      container_name: 'elasticsearch'
    };

    const composeSpec:
        ComposeSpec = {version: '2.0', services: {service1: serviceSpec1}};

    const project =
        new Project({projectName: 'test', composeSpec, pull: false});

    expect(project.networks).toHaveLength(1);
    expect(project.networks[0].driver).toBe('bridge');
    expect(project.networks[0].name.name).toEqual('test_default');
  });
});
