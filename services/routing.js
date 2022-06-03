const { get_nodes, calculate_distance_matrix, calculate_savings_matrix, map_savings, sort_json, get_first_node, build_steps, build_route } = require("../utils/funtions.js");


class RoutingService {

  async getOptimalRoute(
    maximun_distance,
    considerer_traffic,
    plot,
    maximun_distance_between_points)
  {
    //console.log(maximun_distance, considerer_traffic, plot, maximun_distance_between_points)
    const routes = require('./../payloadTest.json');
    var nodes = get_nodes(routes);
    var distances = calculate_distance_matrix(nodes);
    var saving = calculate_savings_matrix(distances);
    var mapped_savings = map_savings(saving);
    var ordered_savings = sort_json(mapped_savings, 'saving', 'asc');
    var first_node = get_first_node(distances, nodes);
    var steps = build_steps(ordered_savings, nodes, first_node);
    var route = build_route(steps, nodes);

    return {'routeId': 1, 'steps': route};
  }

}

module.exports = RoutingService;
