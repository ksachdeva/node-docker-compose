import {CommandLineAction, CommandLineStringListParameter} from '@microsoft/ts-command-line';
import {Compose} from '../../compose';
import {Project} from '../../project';
import {AppCommandLine} from '../cmd-line';

export class DownAction extends CommandLineAction {
  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'down',
      summary: 'Stop and remove containers, networks, images, and volumes',
      documentation: `By default, the only things removed are:
      - Containers for services defined in the Compose file
      - Networks defined in the networks section of the Compose file
      - The default network, if one is used
      Networks and volumes defined as external are never removed.`
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    const project = new Project(this._parser.config);
    const compose = new Compose(project);

    await compose.down();

    return Promise.resolve();
  }
}
