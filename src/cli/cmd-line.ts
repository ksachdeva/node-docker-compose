import {CommandLineParser, CommandLineStringParameter} from '@microsoft/ts-command-line';
import * as fs from 'fs-extra';
import * as path from 'path';

import {ProjectConfig} from '../project-config';

import {KillAction, PullAction, RemoveAction, UpAction} from './actions';

export class AppCommandLine extends CommandLineParser {
  public config: ProjectConfig;

  private _composeFile: CommandLineStringParameter;
  private _projectName: CommandLineStringParameter;

  constructor() {
    super({
      toolFilename: 'ndc',
      toolDescription:
          'Define and run multi-container applications with Docker.'
    });

    this.config = {projectName: '', pull: false, composeSpec: ''};

    this._populateActions();
  }

  protected onDefineParameters(): void {
    this._composeFile = this.defineStringParameter({
      parameterLongName: '--file',
      parameterShortName: '-f',
      required: false,
      defaultValue: 'docker-compose.yaml',
      argumentName: 'COMPOSE_FILE_PATH',
      description:
          'Specify an alternate compose file (default: docker-compose.yaml)'
    });

    this._projectName = this.defineStringParameter({
      parameterLongName: '--project-name',
      parameterShortName: '-p',
      required: false,
      argumentName: 'PROJECT_NAME',
      description: 'Specify an alternate project name (default: directory name)'
    });
  }

  protected onExecute(): Promise<void> {
    // validate if the file exists
    if (!fs.pathExistsSync(this._composeFile.value as string)) {
      return Promise.reject(new Error('Invalid path to compose file !'));
    }

    this.config.composeSpec = this._composeFile.value as string;

    // if project name is not specified then we pick the directory
    // name of specified compose file
    if (!this._projectName.value) {
      const dname =
          path.basename(path.dirname(this._composeFile.value as string));
      this.config.projectName = `${dname}_default`;
    } else {
      this.config.projectName = this._projectName.value as string;
    }

    return super.onExecute();
  }

  private _populateActions(): void {
    this.addAction(new UpAction(this));
    this.addAction(new PullAction(this));
    this.addAction(new KillAction(this));
    this.addAction(new RemoveAction(this));
  }
}
