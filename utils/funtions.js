const { abs, pi } = require("mathjs");

function get_nodes(routes) {
  var nodes = [];

  nodes.push([[0, 0], "origin", 0]);

  for (i = 0; i < routes.length; i++) {
    nodes.push([routes[i]["pickup_location"], "pickup", nodes.length + 1]);
    nodes.push([routes[i]["delivery_location"], "delivery", nodes.length - 1]);
  }

  return nodes;
}

function calculate_distance_matrix(nodes) {
  var matrix = [];
  var distance = 0;

  for (i = 0; i < nodes.length; i++) {
    var column = new Array(i).fill(0);
    for (j = i; j < nodes.length; j++) {
      distance =
        abs(nodes[i][0][0] - nodes[j][0][0]) +
        abs(nodes[i][0][1] - nodes[j][0][1]);
      column.push(distance);
    }
    matrix.push(column);
  }

  return matrix;
}

function calculate_savings_matrix(distance_matrix) {
  var matrix = [];

  for (i = 1; i < distance_matrix.length - 1; i++) {
    var column = new Array(i).fill(0);
    for (j = i +1; j < distance_matrix.length; j++) {
      p0_p1 = distance_matrix[0][i] * 2;
      p0_p2 = distance_matrix[0][j] * 2;
      p1_p2 = distance_matrix[i][j];
      p0_p1_p2_p0 = distance_matrix[0][i] + p1_p2 + distance_matrix[0][j];
      saving = p0_p1 + p0_p2 - p0_p1_p2_p0;
      column.push(saving);
    }
    matrix.push(column);
  }

  matrix.forEach(column=> console.log(column.join(", "), `length: ${column.length}`))


  return matrix;
}

function map_savings(savings_matrix) {
  var array = [];

  for (i = 0; i < savings_matrix.length; i++) {
    for (j = 0; j < savings_matrix[i].length; j++) {
      data = {
        node1: i+1,
        node2: j+1,
        saving: savings_matrix[i][j],
      };
      array.push(data);
    }
  }

  return array;
}

function sort_json(data, key, orden) {
  return data.sort(function (a, b) {
    var x = a[key],
      y = b[key];

    if (orden === "asc") {
      return x < y ? -1 : x > y ? 1 : 0;
    }

    if (orden === "desc") {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  });
}

function get_first_node(distance_matrix, nodes) {
  var node = 0;
  var aux = distance_matrix[0];
  aux.splice(0, 1);
  min = Math.abs(Math.max());
  for (i = 0; i < aux.length; i++) {
    if (aux[i] < min && nodes[i + 1][1] === "pickup") {
      min = aux[i];
      node = i + 1;
    }
  }

  return node;
}

function build_steps(ordered_savings, nodes, first_node) {
  var route = [];
  var pickup = [];
  var delivery = [];
  var aux = first_node;
  route.push(0);
  route.push(first_node);
  pickup.push(first_node);
  ordered_savings = ordered_savings.filter(({saving})=> saving)

  for (i = 0; i < ordered_savings.length; i++) {
    if (ordered_savings[i]["node1"] === first_node && aux === first_node) {
      if (nodes[ordered_savings[i]["node2"]][1] === "pickup") {
        route.push(ordered_savings[i]["node2"]);
        aux = ordered_savings[i]["node2"];
        pickup.push(ordered_savings[i]["node2"]);
      } else if (pickup.includes(ordered_savings[i]["node1"])){
        route.push(ordered_savings[i]["node2"]);
        aux = ordered_savings[i]["node2"];
        delivery.push(ordered_savings[i]["node2"]);
      }
    } else if (
      ordered_savings[i]["node2"] === first_node &&
      aux === first_node
    ) {
      if (nodes[ordered_savings[i]["node1"]][1] === "pickup") {
        route.push(ordered_savings[i]["node1"]);
        aux = ordered_savings[i]["node1"];
        pickup.push(ordered_savings[i]["node1"]);
      } else if (pickup.includes(ordered_savings[i]["node1"][2])) {
        route.push(ordered_savings[i]["node1"]);
        aux = ordered_savings[i]["node1"];
        delivery.push(ordered_savings[i]["node1"]);
      }
    } else if (
      route.includes(ordered_savings[i]["node1"]) &&
      !route.includes(ordered_savings[i]["node2"]) && aux === ordered_savings[i]["node1"]
    ) {
      console.log("ENTER IN NODE2 Case")
      console.log(nodes[ordered_savings[i]["node2"]][1])
      console.log(nodes[ordered_savings[i]["node1"]][2])
      if (
        nodes[ordered_savings[i]["node2"]][1] === "delivery" &&
        pickup.includes(nodes[ordered_savings[i]["node2"]][2])
      ) {
        route.push(ordered_savings[i]["node2"]);
        aux = ordered_savings[i]["node2"];
        delivery.push(ordered_savings[i]["node2"]);
      } else if (
        nodes[ordered_savings[i]["node2"]][1] === "pickup" &&
        aux === ordered_savings[i]["node1"]
      ) {
        route.push(ordered_savings[i]["node2"]);
        aux = ordered_savings[i]["node2"];
        pickup.push(ordered_savings[i]["node2"]);
      }
    } else if (
      route.includes(ordered_savings[i]["node2"]) &&
      !route.includes(ordered_savings[i]["node1"]) &&
      aux === ordered_savings[i]["node2"]
    ) {
      if (
        nodes[ordered_savings[i]["node1"]][1] === "delivery" &&
        pickup.includes(nodes[ordered_savings[i]["node2"]][2])
      ) {
        route.push(ordered_savings[i]["node1"]);
        aux = ordered_savings[i]["node1"];
        delivery.push(ordered_savings[i]["node1"]);
      } else if (
        nodes[ordered_savings[i]["node1"]][1] === "pickup" &&
        aux === ordered_savings[i]["node2"]
      ) {
        route.push(ordered_savings[i]["node1"]);
        aux = ordered_savings[i]["node1"];
        pickup.push(ordered_savings[i]["node1"]);
      }
    }
    console.log("Iteration", i)
    console.log(ordered_savings[i])
    console.log(route)
    console.log(aux)
    console.log(delivery)
    console.log(pickup)
  }
  route.push(0);

  return route;
}

function build_route(steps, nodes) {
  var route = [];
  route.push({ id: 0, point: [0, 0] });

  for (i = 1; i < steps.length - 1; i++) {
    route.push({ id: steps[i], point: nodes[steps[i]][0] });
  }
  route.push({ id: 0, point: [0, 0] });

  return route;
}

module.exports = {
  get_nodes,
  calculate_distance_matrix,
  calculate_savings_matrix,
  map_savings,
  sort_json,
  get_first_node,
  build_steps,
  build_route,
};
