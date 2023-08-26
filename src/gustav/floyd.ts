type Weight = number | null;

interface Graph {
  [key: string]: { [key: string]: Weight };
}

export function floydWarshall(graph: Graph): {
  [key: string]: { [key: string]: Weight };
} {
  const dist: { [key: string]: { [key: string]: Weight } } = {};

  // Initialization: Fill the distance matrix with current weights or Infinity, and 0 for diagonal
  for (const node in graph) {
    dist[node] = {};

    for (const neighbor in graph) {
      if (node === neighbor) {
        dist[node][neighbor] = 0;
      } else if (graph[node][neighbor] !== undefined) {
        dist[node][neighbor] = graph[node][neighbor];
      } else {
        dist[node][neighbor] = Infinity;
      }
    }
  }

  // Core Floyd-Warshall algorithm
  for (const k in graph) {
    for (const i in graph) {
      for (const j in graph) {
        if (dist[i][k]! + dist[k][j]! < dist[i][j]!) {
          dist[i][j] = dist[i][k]! + dist[k][j]!;
        }
      }
    }
  }

  return dist;
}
