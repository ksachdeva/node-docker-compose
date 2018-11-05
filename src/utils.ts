import {DepGraph} from 'dependency-graph';
import * as _ from 'lodash';

import {ServiceDefinition} from './types/service';

export function getOrderedServiceList(services: ServiceDefinition[]):
    ServiceDefinition[] {
  const graph = new DepGraph();

  // build the nodes of the graph first
  _.forEach(services, (s) => graph.addNode(s.name.name));

  // now add the dependencies
  _.forEach(services, (s) => {
    const dependencies = s.dependsOn.map((d) => d.name);
    _.forEach(dependencies, (d) => graph.addDependency(s.name.name, d));
  });

  // now we find the overall order
  const od = graph.overallOrder();

  return od.map((o) => services.filter((s) => s.name.name === o)[0]);
}

const ENVIRONMENT_VARIABLES_REGEX = [
  {
    lhs: '\\\$',
    cleanLhs: '$',
    val: '[a-zA-Z_]+[a-zA-Z0-9_]*',
    rhs: '',
    sep: ''
  },
  {
    lhs: '\\\${',
    cleanLhs: '${',
    val: '[a-zA-Z_]+[a-zA-Z0-9_]*',
    rhs: '}',
    sep: ' *'
  }
];

export function patchEnvironmentVariables(
    text: string, env: {[key: string]: string}) {
  // we run each regular express once and then patch the output
  let result: string = text;
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < ENVIRONMENT_VARIABLES_REGEX.length; i++) {
    const regExpObj = ENVIRONMENT_VARIABLES_REGEX[i];
    const regExpStr = `${regExpObj.lhs}${regExpObj.sep}${regExpObj.val}${
        regExpObj.sep}${regExpObj.rhs}`;
    const matches = result.match(new RegExp(regExpStr, 'g'));

    // perform the substitution
    if (matches !== null) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < matches.length; j++) {
        const envVarName = matches[j]
                               .replace(regExpObj.cleanLhs, '')
                               .replace(regExpObj.rhs, '')
                               .trim();
        const envVarValue = env[envVarName];

        if (envVarValue) {
          result = result.replace(matches[j], envVarValue || '');
        }
      }
    }
  }

  return result;
}
