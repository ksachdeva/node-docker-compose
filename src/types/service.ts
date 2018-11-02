import {ValidationError} from '../errors';
import {Restart} from './alias';
import {ServiceSpec} from './compose-spec';
import {ContainerName} from './container-name';
import {ImageName} from './image-name';
import {NetworkName} from './network-name';
import {PortMap} from './port-map';
import {ServiceName} from './service-name';
import {VolumeDefinition} from './volume';

export class ServiceDefinition {
  public readonly name: ServiceName;
  public readonly imageName: ImageName;
  public readonly containerName: ContainerName|null;
  public readonly ports: PortMap[];
  public readonly dependsOn: ServiceName[];
  public readonly restart: Restart = '';
  public readonly networks: NetworkName[];
  public readonly privileged: boolean;
  public readonly volumes: VolumeDefinition[];

  public constructor(
      serviceName: ServiceName, serviceSpec: ServiceSpec,
      readonly projectName: string) {
    this.name = serviceName;
    this.imageName = new ImageName(serviceSpec.image);
    this.ports = [];
    this.dependsOn = [];
    this.networks = [];
    this.volumes = [];
    this.containerName = null;
    this.privileged = false;

    if (serviceSpec.container_name === undefined) {
      throw new ValidationError(
          'Please specify the container names for the service !');
    }

    this.containerName = new ContainerName(serviceSpec.container_name);

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

    if (serviceSpec.privileged) {
      this.privileged = serviceSpec.privileged;
    }

    if (serviceSpec.volumes) {
      this.volumes = serviceSpec.volumes.map((v) => new VolumeDefinition(v));
    }
  }
}
