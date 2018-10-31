import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import {ComposeSpec} from './types/compose-spec';

export function convertToJSON(composeFilePath: string): ComposeSpec {
  // TODO : translate YAML errors to custom errors
  return yaml.safeLoad(fs.readFileSync(composeFilePath, 'utf8'));
}
