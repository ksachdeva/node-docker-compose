import Docker from 'dockerode';
import {Container} from '../../src/container';
import {ContainerName} from '../../src/types';

describe('container', () => {
  it('findAvailable basic [mocked dockerode]', async () => {
    const dc = {
      listContainers: jest.fn(() => {
        return [
          {Names: ['/boring_ssl'], Id: '2345'},
          {Names: ['/interesting_ssl'], Id: '3489'}
        ];
      })
    };

    const containersToQuery: ContainerName[] = [
      new ContainerName('/boring_ssl'), new ContainerName('/lookingfor_ssl'),
      new ContainerName('/lookingfor_this_one_ssl')
    ];

    const result = await Container.findAvailable(dc as any, containersToQuery);

    expect(result[0]).toHaveLength(1);
    expect(result[1]).toHaveLength(2);

    expect(result[0][0].Names).toHaveLength(1);
    expect(result[0][0].Names[0]).toEqual('/boring_ssl');
    expect(result[0][0].Id).toEqual('2345');

    expect(result[1][0].name).toEqual('/lookingfor_ssl');
    expect(result[1][1].name).toEqual('/lookingfor_this_one_ssl');
  });

  it('findAvailable found all [mocked dockerode]', async () => {
    const dc = {
      listContainers: jest.fn(() => {
        return [
          {Names: ['/boring_ssl'], Id: '2345'},
          {Names: ['/interesting_ssl'], Id: '3489'},
          {Names: ['/lookingfor_ssl'], Id: '112345'},
          {Names: ['/lookingfor_this_one_ssl'], Id: '2333345'},
        ];
      })
    };

    const containersToQuery: ContainerName[] = [
      new ContainerName('/boring_ssl'), new ContainerName('/lookingfor_ssl'),
      new ContainerName('/lookingfor_this_one_ssl')
    ];

    const result = await Container.findAvailable(dc as any, containersToQuery);

    expect(result[0]).toHaveLength(3);
    expect(result[1]).toHaveLength(0);
  });

  it('findAvailable not found any [mocked dockerode]', async () => {
    const dc = {
      listContainers: jest.fn(() => {
        return [];
      })
    };

    const containersToQuery: ContainerName[] = [
      new ContainerName('/boring_ssl'), new ContainerName('/lookingfor_ssl'),
      new ContainerName('/lookingfor_this_one_ssl')
    ];

    const result = await Container.findAvailable(dc as any, containersToQuery);

    expect(result[0]).toHaveLength(0);
    expect(result[1]).toHaveLength(3);

    expect(result[1][0].name).toEqual('/boring_ssl');
    expect(result[1][1].name).toEqual('/lookingfor_ssl');
    expect(result[1][2].name).toEqual('/lookingfor_this_one_ssl');
  });
});
