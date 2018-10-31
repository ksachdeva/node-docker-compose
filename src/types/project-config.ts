import {ComposeSpec} from './compose-spec';

export interface ProjectConfig {
  projectName: string;
  composeSpec: string|ComposeSpec;
  pull: boolean;
}
