import { Port } from './alias';

export class PortMap {
  public readonly host: Port;
  public readonly container: Port;

  public constructor(portMap: string) {
    this.host = parseInt(portMap.substr(0, portMap.lastIndexOf(':')), 10);
    this.container = parseInt(portMap.substr(portMap.lastIndexOf(':') + 1), 10);
  }
}
