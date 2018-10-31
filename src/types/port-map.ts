import {Port} from './port';

export class PortMap {
  public readonly src: Port;
  public readonly dst: Port;

  public constructor(portMap: string) {
    this.src = parseInt(portMap.substr(0, portMap.lastIndexOf(':')), 10);
    this.dst = parseInt(portMap.substr(portMap.lastIndexOf(':') + 1), 10);
  }
}
