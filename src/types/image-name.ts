import {ImageTag} from './image-tag';
import {RepoName} from './repo-name';

export class ImageName {
  public readonly repoName: RepoName;
  public readonly tag: ImageTag;
  public constructor(readonly name: string) {
    // TODO validation on _imageName
    // we divide it into the reponame and the tag
    this.repoName = new RepoName(name.substr(0, name.lastIndexOf(':')));
    this.tag = new ImageTag(name.substr(name.lastIndexOf(':') + 1));
  }

  public isEqual(name: ImageName): boolean {
    return this.repoName.isEqual(name.repoName) && this.tag.isEqual(name.tag);
  }

  public toString() {
    return this.name;
  }
}
