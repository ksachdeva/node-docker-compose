import { Compose } from '../../compose';
import { Project } from '../../project';
import { AppCommandLine } from '../cmd-line';
import { BaseAction } from './base';

export class UpAction extends BaseAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'up',
      summary: 'Create and start containers',
      documentation: 'Create and start containers'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void { }

  protected async onExecute(): Promise<void> {
    await super.onExecute();
    const project = new Project(this._parser.config);
    const compose = new Compose(project, this.docker);

    await compose.up();

    return Promise.resolve();
  }
}
