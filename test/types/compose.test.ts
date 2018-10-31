import {Compose} from '../../src/compose';
import {ComposeSpec, ServiceSpec} from '../../src/types/compose-spec';
import {Project} from '../../src/types/project';

describe('compose', () => {
  it('Basic pull test', async () => {
    const serviceSpec1: ServiceSpec = {
      image : 'docker.elastic.co/elasticsearch/elasticsearch:6.4.2',
      ports : [ '9200:9201', '9300:9302' ]
    };

    const composeSpec:
      ComposeSpec = { version : '2.0', services : { service1 : serviceSpec1 } };

    const project =
      new Project({ projectName : 'test', composeSpec, pull : false });

    const compose = new Compose(project);

    await compose.pullImages();
  });
});
