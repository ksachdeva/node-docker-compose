import Docker from 'dockerode';
import { NetworkDriverType, Restart } from './alias';
import { ComposeVersion } from './compose-version';

export interface ServiceSpec {
  image: string;
  restart?: Restart;
  container_name: string;  // Note - make it mandatory for some time
  network_mode?: string;
  runtime?: string;
  ports?: string[];
  volumes?: string[];
  networks?: string[];
  depends_on?: string[];
  privileged?: boolean;
  command?: string[];
  logging?:
  { driver: Docker.LoggingDriverType; options?: { [key: string]: string } };
  devices?: string[];
}

export interface NetworkSpec {
  driver: NetworkDriverType;
}

export interface ComposeSpec {
  version: ComposeVersion;
  services: { [key: string]: ServiceSpec };
  networks?: { [key: string]: NetworkSpec };
}
