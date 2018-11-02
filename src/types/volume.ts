import * as _ from 'lodash';
import {ValidationError} from '../errors';

export class VolumeDefinition {
  public readonly hostPath: string;
  public readonly containerPath: string;
  public readonly mode: string;
  public constructor(entry: string) {
    // There are five posibilities here

    // 1. # Just specify a path and let the Engine create a volume
    // e.g - /var/lib/mysql

    // 2. Specify an absolute path mapping
    // e.g - /opt/data:/var/lib/mysql

    // 3. User-relative path
    // e.g. - ~/configs:/etc/configs/:ro

    // 4. Path on the host, relative to the Compose file
    // e.g. - ./cache:/tmp/cache

    // 5. Named volume
    // e.g. datavolume:/var/lib/mysql

    this.mode = 'rw';  // default mode

    if (entry.indexOf(':') === -1) {
      throw new ValidationError('Not supported volume entry ..');
    }

    if (!entry.startsWith('/')) {
      throw new ValidationError('Only absolute path mapping is supported ..');
    }

    const parts = _.split(entry, ':');
    this.hostPath = parts[0];
    this.containerPath = parts[1];
    if (parts.length === 3) {
      this.mode = parts[2];
    }
  }

  public get value() {
    return `${this.hostPath}:${this.containerPath}:${this.mode}`;
  }
}
