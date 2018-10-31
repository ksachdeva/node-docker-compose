import {CommandLineAction} from '@microsoft/ts-command-line';
import {Project} from '../../types/project';
import {AppCommandLine} from '../cmd-line';

export class UpAction extends CommandLineAction {

  constructor(private _parser: AppCommandLine) {
    super({
      actionName : 'up',
      summary : 'Create and start containers',
      documentation : 'Create and start containers'
    });
  }

  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    // build the project
    const project = new Project(this._parser.config);

    return Promise.resolve();
  }
}
