import {validateComposeSpec} from '../../src/compose-spec-validator';
import {ValidationError} from '../../src/errors';
import {ComposeSpec, NetworkSpec, ServiceSpec} from '../../src/types/compose-spec';
import {Project} from '../../src/types/project';

describe('spec-validator', () => {
  it('Basic correct definition', () => {
    const networkSpec: NetworkSpec = {driver: 'bridge'};

    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      networks: ['docker_elk']
    };

    const composeSpec: ComposeSpec = {
      version: '2.0',
      networks: {docker_elk: networkSpec},
      services: {aservice: serviceSpec}
    };

    const project =
        new Project({projectName: 'test', composeSpec, pull: false});
    validateComposeSpec(project);
  });

  it('Service should not have undefined network', () => {
    const networkSpec: NetworkSpec = {driver: 'bridge'};

    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      networks: ['docker_elk']
    };

    const composeSpec: ComposeSpec = {
      version: '2.0',
      networks: {anetwork: networkSpec},
      services: {aservice: serviceSpec}
    };

    const project = new Project(
        {projectName: 'test', composeSpec: composeSpec, pull: false});
    expect(() => {
      validateComposeSpec(project);
    }).toThrowError(ValidationError);
  });

  it('Service should not have undefined dependency', () => {
    const serviceSpec: ServiceSpec = {
      image: 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports: ['9200:9201', '9300:9302'],
      depends_on: ['some_service']
    };

    const composeSpec:
        ComposeSpec = {version: '2.0', services: {aservice: serviceSpec}};

    const project =
        new Project({projectName: 'test', composeSpec, pull: false});
    expect(() => {
      validateComposeSpec(project);
    }).toThrowError(ValidationError);
  });
});
