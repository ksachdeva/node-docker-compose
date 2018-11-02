import Docker from 'dockerode';
import * as _ from 'lodash';
import winston from 'winston';

// tslint:disable-next-line:max-line-length
import {CONTAINER_NUMBER_LABEL, NODE_DOCKER_COMPOSE_VERSION, PROJECT_LABEL, SERVICE_LABEL, VERSION_LABEL} from './consts';
import {ContainerName, ServiceDefinition} from './types';

export type AvailableContainers = Docker.ContainerInfo[];
export type NotAvailableContainers = ContainerName[];
export type FindAvailableContainersResponse =
    [AvailableContainers, NotAvailableContainers];

export class Container {
  public static async findAvailable(
      dc: Docker, containersToQuery: ContainerName[],
      includeAll: boolean): Promise<FindAvailableContainersResponse> {
    // we get all the containers and then check
    // if any of the one that we want to check are present
    const containerInfo = await dc.listContainers({all: includeAll});

    // we need to build just the map of ContainerName
    // Note - a container can have many names apparently !
    const listedContainers = _.flatten(
        containerInfo.map((c) => c.Names.map((n) => new ContainerName(n))));

    const availableContainers =
        _.intersectionWith(listedContainers, containersToQuery, (c1, c2) => {
          return c1.isEqual(c2);
        });

    listedContainers.forEach((l) => winston.debug(`Found ${l} ..`));

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
    await Promise.all(containers.map((c) => {
      winston.info(`Killing ${c.Names[0]} ... `);
      dc.getContainer(c.Id).kill();
    }));
  }

  public static async remove(
      dc: Docker, containers: AvailableContainers, force: boolean,
      removeVolumes: boolean) {
    await Promise.all(containers.map((c) => {
      winston.info(`Removing ${c.Names[0]} ... `);
      dc.getContainer(c.Id).remove({force, v: removeVolumes});
    }));
  }

  public static create(
      dc: Docker, service: ServiceDefinition,
      containerIdx: number): Promise<Docker.Container> {
    winston.info(
        `Creating container ${service.containerName} for ${service.name} ..`);

    const opts: Docker.ContainerCreateOptions = {
      Image: service.imageName.name,
      name: (service.containerName as ContainerName).name,
      HostConfig: {
        RestartPolicy: {Name: service.restart},
        Privileged: service.privileged
      },
      Labels: {
        [PROJECT_LABEL]: service.projectName,
        [VERSION_LABEL]: NODE_DOCKER_COMPOSE_VERSION,
        [SERVICE_LABEL]: service.name.name,
        [CONTAINER_NUMBER_LABEL]: containerIdx.toString()
      }
    };

    if (service.cmd) {
      opts.Cmd = service.cmd;
    }

    if (service.ports.length > 0) {
      const portBindings: Docker.PortMap = {};
      for (const p of service.ports) {
        portBindings[`${p.container}/tcp`] = [{HostPort: p.host.toString()}];
      }
      if (opts.HostConfig) {
        opts.HostConfig.PortBindings = portBindings;
      }
    }

    if (service.volumes.length > 0) {
      if (opts.HostConfig) {
        opts.HostConfig.Binds = service.volumes.map((v) => v.value);
      }
    }

    return dc.createContainer(opts);
  }

  public static start(dc: Docker, container: Docker.Container) {
    winston.info(`Starting the container ${container.id} ..`);
    return container.start();
  }
}
