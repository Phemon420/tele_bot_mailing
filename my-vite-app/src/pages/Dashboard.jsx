"use client"

import React,{ useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { protectedAPI } from "../../api/api"
import { User, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Node from '../components/node/node';
import { dijkstra, getNodesInShortestPathOrder } from '../components/algorithms/djikstra';

const START_NODE_ROW = 1;
const START_NODE_COL = 8;
const FINISH_NODE_ROW = 13;
const FINISH_NODE_COL = 35;

function createInitialGrid() {
  const grid = [];
  for (let row = 0; row < 15; row++) {
    const currentRow = [];
    for (let col = 0; col < 39; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
}

function createNode(col, row) {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
}

function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      if (node.isStart || node.isFinish) return;
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-visited';
    }, 10 * i);
  }
}

function animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      if (node.isStart || node.isFinish) return;
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-shortest-path';
    }, 50 * i);
  }
}


function Dashboard() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initialGrid = createInitialGrid();
    setGrid(initialGrid);
  }, []);

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const visualizeDijkstra = () => {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    // console.log(nodesInShortestPathOrder);
    // console.log(visitedNodesInOrder);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }


  return (
    <>
    <div className="flex justify-center items-center mb-4">
      <button onClick={visualizeDijkstra} className="btn-outline border-black border-2 p-5">Find path from green to red dot</button>
    </div>
    <div className="flex justify-center items-center">
      <h1 className="text-2xl font-bold">Create your own obstacles by dragging the mouse through the grid</h1>
    </div>
      <div className="mt-[100px]">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { col, row, isFinish, isStart, isWall } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  row={row}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                ></Node>
              );
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default Dashboard