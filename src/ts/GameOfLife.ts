import { Matrix } from './Matrix';
import { Patterns } from './Patterns';

export class GameOfLife {
  private canvas: HTMLCanvasElement;
  private step: number;
  private cellSize: number = 16;
  private lastStepTime: number = 0;
  private cells: Matrix<number>;
  private animationFrameRequestId: number;
  private evolving: boolean;
  public stepInterval: number = 150;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.cells = new Matrix<number>(100, 100);
  }

  get context() {
    return this.canvas.getContext('2d')
  }

  startRendering() {
    this.animationFrameRequestId = requestAnimationFrame(this.loop.bind(this));
  }

  stopRendering() {
    if (!this.animationFrameRequestId)
      return;
    cancelAnimationFrame(this.animationFrameRequestId);
    this.animationFrameRequestId = null;
  }

  startEvolving() {
    this.evolving = true;
  }

  stopEvolving() {
    this.evolving = false;
  }

  loop() {
    this.render();

    if (this.evolving && performance.now() > this.lastStepTime + this.stepInterval) {
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

  nextStep(): void {
    const newState = new Matrix<number>(this.cells.width, this.cells.height);

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

  pasteGlider(x: number, y: number, rotation: number): void {
    this.cells.paste(Patterns.glider.rotate(rotation), x, y);
  }

  pasteLightweightSpaceship(x: number, y: number, rotation: number): void {
    this.cells.paste(Patterns.lightweightSpaceship.rotate(rotation), x, y);
  }

  getLiveNeighbourCount(dx: number, dy: number): number {
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

  getCellState(state: number, liveNeighbours: number): number {
    if (state === 1)
      return liveNeighbours < 2 || liveNeighbours > 3 ? 0 : 1;
    else
      return liveNeighbours === 3 ? 1 : 0;
  }
}