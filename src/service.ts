import {Restart} from './types/alias';
import {ServiceSpec} from './types/compose-spec';
import {ContainerName} from './types/container-name';
import {ImageName} from './types/image-name';
import {NetworkName} from './types/network-name';
import {PortMap} from './types/port-map';
import {ServiceName} from './types/service-name';

export class Service {
  public readonly name: ServiceName;
  public readonly imageName: ImageName;
  public readonly containerName: ContainerName|null;
  public readonly ports: PortMap[];
  public readonly dependsOn: ServiceName[];
  public readonly restart: Restart = 'no';
  public readonly networks: NetworkName[];

  public constructor(serviceName: ServiceName, serviceSpec: ServiceSpec) {
    this.name = serviceName;
    this.imageName = new ImageName(serviceSpec.image);
    this.ports = [];
    this.dependsOn = [];
    this.networks = [];
    this.containerName = null;

    if (serviceSpec.container_name !== undefined) {
      this.containerName = new ContainerName(serviceSpec.container_name);
    }

    if (serviceSpec.ports !== undefined) {
      this.ports = serviceSpec.ports.map((p: string) => new PortMap(p));
    }

    if (serviceSpec.depends_on !== undefined) {
      this.dependsOn =
          serviceSpec.depends_on.map((s: string) => new ServiceName(s));
    }

    if (serviceSpec.restart !== undefined) {
      this.restart = serviceSpec.restart;
    }

    if (serviceSpec.networks !== undefined) {
      this.networks =
          serviceSpec.networks.map((s: string) => new NetworkName(s));
    }
  }
}