export class ServiceName {
  constructor(readonly name: string) {
    // for now just assign the argument
    // TODO: run the validation of the passed argument
  }

  public isEqual(name: ServiceName|string): boolean {
    if (name instanceof ServiceName) {
      return this.name === name.name;
    }
    return this.name === name;
  }
}
