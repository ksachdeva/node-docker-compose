import {CommandLineAction} from '@microsoft/ts-command-line';
import {Compose} from '../../compose';
import {Project} from '../../project';
import {AppCommandLine} from '../cmd-line';

export class PsAction extends CommandLineAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'ps',
      summary: 'List Containers',
      documentation: 'List Containers.'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    // build the project
    const project = new Project(this._parser.config);
    const compose = new Compose(project);

    const containerInfos = await compose.ps();

    containerInfos.forEach((c) => {
      console.log(`${c.Names[0]} - ${c.Status} - ${c.State} - ${c.Command} - ${
          c.Created} - ${c.Image}`);
    });

    return Promise.resolve();
  }
}
