export class NetworkName {
  constructor(readonly name: string) {
    // for now just assign the argument
    // TODO: run the validation of the passed argument
  }

  public isEqual(name: NetworkName|string): boolean {
    if (name instanceof NetworkName) {
      return this.name === name.name;
    }
    return this.name === name;
  }

  public toString() {
    return this.name;
  }
}
