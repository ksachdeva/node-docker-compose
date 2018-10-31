import {CommandLineAction} from '@microsoft/ts-command-line';
import {Compose} from '../../compose';
import {Project} from '../../types/project';
import {AppCommandLine} from '../cmd-line';

export class PullAction extends CommandLineAction {

  constructor(private _parser: AppCommandLine) {
    super({
      actionName : 'pull',
      summary : 'Pull service images',
      documentation :
        'Pulls images for services defined in a Compose file, but does not start the containers.'
    });
  }

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    // build the project
    const project = new Project(this._parser.config);
    const compose = new Compose(project);

    await compose.pullImages();

    return Promise.resolve();
  }
}
