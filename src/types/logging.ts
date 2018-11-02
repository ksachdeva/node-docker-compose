import Docker from 'dockerode';

export class LoggingDefinition {
  public constructor(
      readonly driver: Docker.LoggingDriverType = 'json-file',
      readonly options?: {[key: string]: string}) {}
}
