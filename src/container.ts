import Docker from 'dockerode';
import * as _ from 'lodash';

import {ContainerName} from './types';

export type AvailableContainers = Docker.ContainerInfo[];
export type NotAvailableContainers = ContainerName[];
export type FindAvailableContainersResponse =
    [AvailableContainers, NotAvailableContainers];

export class Container {
  public static async findAvailable(
      dc: Docker, containersToQuery: ContainerName[]):
      Promise<FindAvailableContainersResponse> {
    // we get all the containers and then check
    // if any of the one that we want to check are present
    const containerInfo = await dc.listContainers();

    // we need to build just the map of ContainerName
    // Note - a container can have many names apparently !
    const listedContainers = _.flatten(
        containerInfo.map((c) => c.Names.map((n) => new ContainerName(n))));

    listedContainers.forEach(console.log);

    const availableContainers =
        _.intersectionWith(listedContainers, containersToQuery, (c1, c2) => {
          return c1.isEqual(c2);
        });

    const notAvailableContainers =
        _.differenceWith(containersToQuery, listedContainers, (c1, c2) => {
          return c1.isEqual(c2);
        });

    // now we need to convert availableContainers into the ContainerInfo
    // TODO: Refine the below logic
    const availabeContainersInfo: Docker.ContainerInfo[] = [];
    _.forEach(containerInfo, (c) => {
      availableContainers.forEach((a) => {
        if (_.includes(c.Names, a.name)) {
          availabeContainersInfo.push(c);
        }
      });
    });

    return Promise.resolve<FindAvailableContainersResponse>(
        [availabeContainersInfo, notAvailableContainers]);
  }

  public static async kill(dc: Docker, containers: AvailableContainers) {
    await Promise.all(containers.map((c) => dc.getContainer(c.Id).kill()));
  }
}
