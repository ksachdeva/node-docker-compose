import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { ComposeSpec } from './types/compose-spec';
import { patchEnvironmentVariables } from './utils';

export function convertToJSON(
  composeFilePath: string, env?: { [key: string]: string }): ComposeSpec {
  // read the yaml file as simply text
  let content = fs.readFileSync(composeFilePath, 'utf8');

  if (env) {
    // now patch any environment variables
    content = patchEnvironmentVariables(content, env);
  }

  // TODO : translate YAML errors to custom errors
  return yaml.safeLoad(content) as ComposeSpec;
}
