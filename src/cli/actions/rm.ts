import {CommandLineAction, CommandLineFlagParameter} from '@microsoft/ts-command-line';
import {Compose} from '../../compose';
import {Project} from '../../project';
import {AppCommandLine} from '../cmd-line';

export class RemoveAction extends CommandLineAction {
  private force: CommandLineFlagParameter;
  private stop: CommandLineFlagParameter;
  private volume: CommandLineFlagParameter;

  constructor(private _parser: AppCommandLine) {
    super({
      actionName: 'rm',
      summary: 'Remove stopped service containers.',
      documentation: 'Remove stopped service containers.'
    });
  }

  protected onDefineParameters(): void {
    this.force = this.defineFlagParameter({
      parameterLongName: '--force',
      parameterShortName: '-f',
      required: false,
      description: 'Do not ask to confirm removal'
    });

    this.stop = this.defineFlagParameter({
      parameterLongName: '--stop',
      parameterShortName: '-s',
      required: false,
      description: 'Stop the containers, if required, before removing'
    });

    this.volume = this.defineFlagParameter({
      parameterLongName: '--remove-volume',
      parameterShortName: '-v',
      required: false,
      description: 'Remove any anonymous volume'
    });
  }

  protected async onExecute(): Promise<void> {
    // build the project
    const project = new Project(this._parser.config);
    const compose = new Compose(project);

    await compose.remove(this.stop.value, this.volume.value);

    return Promise.resolve();
  }
}
