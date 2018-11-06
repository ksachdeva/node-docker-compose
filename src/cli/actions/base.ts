import {CommandLineAction} from '@microsoft/ts-command-line';
import Docker from 'dockerode';

export abstract class BaseAction extends CommandLineAction {
  protected docker: Docker;

  // tslint:disable-next-line:no-empty
  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    // build the project
    this.docker = new Docker({socketPath: '/var/run/docker.sock'});

    return Promise.resolve();
  }
}
