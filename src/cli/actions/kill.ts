import {CommandLineAction} from '@microsoft/ts-command-line';
import {Compose} from '../../compose';
import {Project} from '../../project';
import {AppCommandLine} from '../cmd-line';

export class KillAction extends CommandLineAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'kill',
      summary: 'Kill containers.',
      documentation: 'Force stop service containers..'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    // build the project
    const project = new Project(this._parser.config);
    const compose = new Compose(project);

    await compose.kill();

    return Promise.resolve();
  }
}
