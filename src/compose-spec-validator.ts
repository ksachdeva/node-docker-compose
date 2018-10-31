import * as _ from 'lodash';
import {ValidationError} from './errors';
import {Project} from './project';

function _validateNetworksInServices(project: Project) {
  // purpose of this validator is to ensure that Services contains only
  // those networks that have been specified in the project
  const networkNames = project.networks.map((n) => n.name.name);

  _.forEach(project.services, (s) => _.forEach(s.networks, (n) => {
    const result = _.includes(networkNames, n.name);
    if (!result) {
      throw new ValidationError(`Service "${
          s.name.name}" contains an undefined network - "${n.name}"`);
    }
  }));
}

function _validateServiceDependencyExists(project: Project) {
  // purpose of this validator to ensure that if depends_on is specified
  // then its value is that of a service that indeed exists
  const serviceNames = project.services.map((s) => s.name.name);

  _.forEach(project.services, (s) => _.forEach(s.dependsOn, (d) => {
    const result = _.includes(serviceNames, d.name);
    if (!result) {
      throw new ValidationError(`Service "${
          s.name.name}" contains an undefined dependency - "${d.name}"`);
    }
  }));
}

export function validateComposeSpec(project: Project) {
  _validateNetworksInServices(project);
  _validateServiceDependencyExists(project);
}
