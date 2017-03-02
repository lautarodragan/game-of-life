document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.querySelector('canvas');
  const gameOfLife = new GameOfLife(canvas);

  document.querySelector('#start').addEventListener('click', gameOfLife.start.bind(gameOfLife));
  document.querySelector('#stop').addEventListener('click', gameOfLife.stop.bind(gameOfLife));

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  window.gameOfLife = gameOfLife;
  window.canvas = canvas;
});

class GameOfLife {

  constructor(canvas) {
    this.canvas = canvas;
    this.step = 0;
    this.cellSize = 16;
    this.stepInterval = 250;
    this.lastStepTime = 0;
    this.cells = new Matrix(100, 100);
  }

  get context() {
    return this.canvas.getContext('2d')
  }

  start() {
    this.animationFrameRequestId = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    if (!this.animationFrameRequestId)
      return;
    cancelAnimationFrame(this.animationFrameRequestId);
    this.animationFrameRequestId = null;
  }

  loop() {
    this.render();

    if (performance.now() > this.lastStepTime + this.stepInterval) {
      this.lastStepTime = performance.now();
      this.nextStep();
    }

    this.animationFrameRequestId = requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = 'black';

    for (let x = 0; x < this.cells.width; x++) {
      for (let y = 0; y < this.cells.height; y++) {
        const value = this.cells.getValue(x, y);
        this.context.fillStyle = value ? 'black' : 'white';
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        if (!value)
          this.context.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }

  }

  nextStep() {
    const newState = new Matrix(this.cells.width, this.cells.height);

    for (let x = 0; x < this.cells.width; x++) {
      for (let y = 0; y < this.cells.height; y++) {
        const liveNeighbours = this.getLiveNeighbourCount(x, y);
        const newValue = this.getCellState(this.cells.getValue(x, y), liveNeighbours);

        newState.setValue(x, y, newValue);
      }
    }

    this.cells = newState;
    this.step++;
  }

  pasteGlider(x, y) {
    this.cells.paste(glider, x, y);
  }

  getLiveNeighbourCount(dx, dy) {
    let count = 0;
    for (let x = dx - 1; x < dx + 2; x++) {
      for (let y = dy - 1; y < dy + 2; y++) {
        if (x === dx && y === dy)
          continue;
        if (this.cells.isInBounds(x, y) && this.cells.getValue(x, y))
          count++;
      }
    }
    return count;
  }

  getCellState(state, liveNeighbours) {
    if (state === 1)
      return liveNeighbours < 2 || liveNeighbours > 3 ? 0 : 1;
    else
      return liveNeighbours === 3 ? 1 : 0;
  }
}

class Matrix {

  constructor(width, height) {
    this.initialize(width, height)
  }

  initialize(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      this.cells[x].length = this.height;
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y] = 0;
      }
    }
  }

  getValue(x, y) {
    return this.cells[x][y];
  }

  setValue(x, y, value) {
    this.cells[x][y] = value;
  }

  paste(matrix, dx = 0, dy = 0) {
    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        this.cells[dx + x][dy + y] = matrix[x][y];
      }
    }
  }

  iterate(callback) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
}

const glider = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1]
];