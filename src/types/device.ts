import * as _ from 'lodash';
import { ValidationError } from '../errors';

export class DeviceDefinition {
  public readonly hostPath: string;
  public readonly containerPath: string;
  public constructor(entry: string) {
    if (entry.indexOf(':') === -1) {
      throw new ValidationError('Not supported device entry ..');
    }

    if (!entry.startsWith('/')) {
      throw new ValidationError('Only absolute path mapping is supported ..');
    }

    const parts = _.split(entry, ':');
    this.hostPath = parts[0];
    this.containerPath = parts[1];
  }

  public get value() {
    return `${this.hostPath}:${this.containerPath}`;
  }
}
