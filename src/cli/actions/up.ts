import {CommandLineAction} from '@microsoft/ts-command-line';
import {Compose} from '../../compose';
import {Project} from '../../project';
import {AppCommandLine} from '../cmd-line';

export class UpAction extends CommandLineAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'up',
      summary: 'Create and start containers',
      documentation: 'Create and start containers'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    const project = new Project(this._parser.config);
    const compose = new Compose(project);

    await compose.up();

    return Promise.resolve();
  }
}
