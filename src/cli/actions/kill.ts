import { CommandLineAction } from '@rushstack/ts-command-line';
import { Compose } from '../../compose';
import { Project } from '../../project';
import { AppCommandLine } from '../cmd-line';
import { BaseAction } from './base';

export class KillAction extends BaseAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'kill',
      summary: 'Kill containers.',
      documentation: 'Force stop service containers..'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void { }

  protected async onExecute(): Promise<void> {
    await super.onExecute();
    // build the project
    const project = new Project(this._parser.config);
    const compose = new Compose(project, this.docker);

    await compose.kill();

    return Promise.resolve();
  }
}
