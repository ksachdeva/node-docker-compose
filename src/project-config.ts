import {ComposeSpec} from './types/compose-spec';

export interface ProjectConfig {
  projectName: string;
  composeSpec: string|ComposeSpec;
  pull: boolean;
  environmentVariables?: {[key: string]: string};
}
