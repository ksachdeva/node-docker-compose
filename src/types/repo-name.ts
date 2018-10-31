export class RepoName {
  public constructor(readonly name: string) {
    // TODO: run the validation on what constitutes a
    // repo name
  }

  public isEqual(name: RepoName|string): boolean {
    if (name instanceof RepoName) {
      return this.name === name.name;
    }
    return this.name === name;
  }

  public toString() {
    return this.name;
  }
}
