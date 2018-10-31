export class ImageTag {
  public constructor(readonly name: string) {
    // TODO: add the validation for the name
  }

  public isEqual(name: ImageTag|string): boolean {
    if (name instanceof ImageTag) {
      return this.name === name.name;
    }
    return this.name === name;
  }
}
