import {DepGraph} from 'dependency-graph';
import * as _ from 'lodash';

import {Service} from './service';

export function getOrderedServiceList(services: Service[]): Service[] {
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
