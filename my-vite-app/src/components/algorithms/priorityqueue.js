
export class PriorityQueue {
    constructor() {
      this.nodes = [];
    }
  
    enqueue(node, priority) {
      this.nodes.push({ node, priority });
      this.bubbleUp();
    }
  
    dequeue() {
      const minNode = this.nodes[0];
      const lastNode = this.nodes.pop();
      if (this.nodes.length > 0) {
        this.nodes[0] = lastNode;
        this.bubbleDown();
      }
      return minNode.node;
    }
  
    bubbleUp() {
      let index = this.nodes.length - 1;
      const element = this.nodes[index];
  
      while (index > 0) {
        let parentIndex = Math.floor((index - 1) / 2);
        let parent = this.nodes[parentIndex];
  
        if (element.priority >= parent.priority) break;
  
        this.nodes[index] = parent;
        index = parentIndex;
      }
  
      this.nodes[index] = element;
    }
  
    bubbleDown() {
      let index = 0;
      const length = this.nodes.length;
      const element = this.nodes[0];
  
      while (true) {
        let leftChildIdx = 2 * index + 1;
        let rightChildIdx = 2 * index + 2;
        let leftChild, rightChild;
        let swapIndex = null;
  
        if (leftChildIdx < length) {
          leftChild = this.nodes[leftChildIdx];
          if (leftChild.priority < element.priority) {
            swapIndex = leftChildIdx;
          }
        }
  
        if (rightChildIdx < length) {
          rightChild = this.nodes[rightChildIdx];
          if (
            (swapIndex === null && rightChild.priority < element.priority) ||
            (swapIndex !== null && rightChild.priority < leftChild.priority)
          ) {
            swapIndex = rightChildIdx;
          }
        }
  
        if (swapIndex === null) break;
        this.nodes[index] = this.nodes[swapIndex];
        index = swapIndex;
      }
  
      this.nodes[index] = element;
    }
  
    isEmpty() {
      return this.nodes.length === 0;
    }
  }
  