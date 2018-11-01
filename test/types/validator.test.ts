import {ValidationError} from '../../src/errors';
import {Project} from '../../src/project';
import {ComposeSpec, NetworkSpec, ServiceSpec} from '../../src/types/compose-spec';

describe('spec-validator', () => {
  it('Basic correct definition', () => {
    const networkSpec: NetworkSpec = {driver: 'bridge'};

    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      networks: ['docker_elk'],
      container_name: 'elasticsearch'
    };

    const composeSpec: ComposeSpec = {
      version: '2.0',
      networks: {docker_elk: networkSpec},
      services: {aservice: serviceSpec}
    };

    // should not throw any erro
    const project =
        new Project({projectName: 'test', composeSpec, pull: false});
  });

  it('Service should not have undefined network', () => {
    const networkSpec: NetworkSpec = {driver: 'bridge'};

    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      networks: ['docker_elk'],
      container_name: 'elasticsearch'
    };

    const composeSpec: ComposeSpec = {
      version: '2.0',
      networks: {anetwork: networkSpec},
      services: {aservice: serviceSpec}
    };

    expect(() => {
      const project =
          new Project({projectName: 'test', composeSpec, pull: false});
    }).toThrowError(ValidationError);
  });

  it('Service should not have undefined dependency', () => {
    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      depends_on: ['some_service'],
      container_name: 'elasticsearch'
    };

    const composeSpec:
        ComposeSpec = {version: '2.0', services: {aservice: serviceSpec}};

    expect(() => {
      const project =
          new Project({projectName: 'test', composeSpec, pull: false});
    }).toThrowError(ValidationError);
  });
});
