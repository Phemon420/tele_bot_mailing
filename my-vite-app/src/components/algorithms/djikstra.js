// // Performs Dijkstra's algorithm; returns *all* nodes in the order
// // in which they were visited. Also makes nodes point back to their
// // previous node, effectively allowing us to compute the shortest path
// // by backtracking from the finish node.
//  export function dijkstra(grid, startNode, finishNode) {
//     const visitedNodesInOrder = [];
//     startNode.distance = 0;
//     const unvisitedNodes = getAllNodes(grid);
//     while (!!unvisitedNodes.length) {
//       sortNodesByDistance(unvisitedNodes);
//       const closestNode = unvisitedNodes.shift();
//       // If we encounter a wall, we skip it.
//       if (closestNode.isWall) continue;
//       // If the closest node is at a distance of infinity,
//       // we must be trapped and should therefore stop.
//       if (closestNode.distance === Infinity) return visitedNodesInOrder;
//       closestNode.isVisited = true;
//       visitedNodesInOrder.push(closestNode);
//       if(closestNode === finishNode) {
//         console.log("Reached the end");
//         return visitedNodesInOrder;
//        }
//       updateUnvisitedNeighbors(closestNode, grid);
//     }
//   }
  
//   function sortNodesByDistance(unvisitedNodes) {
//     unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
//   }
  
//   function updateUnvisitedNeighbors(node, grid) {
//     const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
//     for (const neighbor of unvisitedNeighbors) {
//       neighbor.distance = node.distance + 1;
//       neighbor.previousNode = node;
//     }
//   }
  
//   function getUnvisitedNeighbors(node, grid) {
//     const neighbors = [];
//     const {col, row} = node;
//     if (row > 0) neighbors.push(grid[row - 1][col]);
//     if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
//     if (col > 0) neighbors.push(grid[row][col - 1]);
//     if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
//     return neighbors.filter(neighbor => !neighbor.isVisited);
//   }
  
//   function getAllNodes(grid) {
//     const nodes = [];
//     for (const row of grid) {
//       for (const node of row) {
//         nodes.push(node);
//       }
//     }
//     return nodes;
//   }
  
//   // Backtracks from the finishNode to find the shortest path.
//   // Only works when called *after* the dijkstra method above.
//   export function getNodesInShortestPathOrder(finishNode) {
//     const nodesInShortestPathOrder = [];
//     let currentNode = finishNode;
//     while (currentNode !== null) {
//       nodesInShortestPathOrder.unshift(currentNode);
//       currentNode = currentNode.previousNode;
//     }
//     return nodesInShortestPathOrder;
//   }
  












import { PriorityQueue } from './priorityqueue'; 

// Performs Dijkstra's algorithm; returns all nodes in the order in which they were visited.
// Also makes nodes point back to their previous node, allowing us to compute the shortest path.
function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;

    // Priority queue to fetch the node with the smallest distance
    const priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(startNode, startNode.distance);

    while (!priorityQueue.isEmpty()) {
      const closestNode = priorityQueue.dequeue();

      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;

      // If the closest node is at a distance of infinity, we must be trapped and should stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      // If we've reached the finish node, return the visited nodes
      if (closestNode === finishNode) return visitedNodesInOrder;

      updateUnvisitedNeighbors(closestNode, grid, priorityQueue);
    }
    return visitedNodesInOrder;
}

// Updates the unvisited neighbors of the current node and adds them to the priority queue.
function updateUnvisitedNeighbors(node, grid, priorityQueue) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const newDistance = node.distance + 1; // Update based on the problem's distance metric.
        if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previousNode = node;
            priorityQueue.enqueue(neighbor, neighbor.distance); // Add to the priority queue
        }
    }
}

// Get unvisited neighbors for the current node.
function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

// Export the necessary functions
export { dijkstra, getNodesInShortestPathOrder };
