export class ContainerName {
  constructor(readonly name: string) {
    // for now just assign the argument
    // TODO: run the validation of the passed argument
  }

  public isEqual(name: ContainerName|string): boolean {
    if (name instanceof ContainerName) {
      return this.name === name.name;
    }
    return this.name === name;
  }
}
