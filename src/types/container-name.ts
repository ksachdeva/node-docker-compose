import * as _ from 'lodash';

function _normalizedName(name: string) {
  return _.trimStart(name, '/');
}

export class ContainerName {
  constructor(readonly name: string) {
    // for now just assign the argument
    // TODO: run the validation of the passed argument
  }

  public isEqual(name: ContainerName|string): boolean {
    if (name instanceof ContainerName) {
      return _normalizedName(this.name) === _normalizedName(name.name);
    }
    return _normalizedName(this.name) === _normalizedName(name);
  }

  public toString() {
    return this.name;
  }
}
