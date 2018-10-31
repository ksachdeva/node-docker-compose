import {ComposeVersion} from './compose-version';
import {NetworkDriverType} from './network-driver-type';
import {Restart} from './restart';

export interface ServiceSpec {
  image: string;
  restart?: Restart;
  container_name?: string;
  ports?: string[];
  volumes?: string[];
  networks?: string[];
  depends_on?: string[];
}

export interface NetworkSpec {
  driver: NetworkDriverType;
}

export interface ComposeSpec {
  version: ComposeVersion;
  services: { [key: string]: ServiceSpec; };
  networks?: { [key: string]: NetworkSpec };
}
