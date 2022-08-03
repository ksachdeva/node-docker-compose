import { Compose } from '../../compose';
import { Project } from '../../project';
import { AppCommandLine } from '../cmd-line';
import { BaseAction } from './base';

export class PullAction extends BaseAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'pull',
      summary: 'Pull service images',
      documentation:
        'Pulls images for services defined in a Compose file, but does not start the containers.'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void { }

  protected async onExecute(): Promise<void> {
    // build the project
    await super.onExecute();
    const project = new Project(this._parser.config);
    const compose = new Compose(project, this.docker);

    await compose.pull();

    return Promise.resolve();
  }
}
