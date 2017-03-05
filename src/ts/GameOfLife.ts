import { Matrix } from './Matrix';
import { Patterns } from './Patterns';

export class GameOfLife {
  private canvas: HTMLCanvasElement;
  private step: number;
  private cellSize: number = 16;
  private lastStepTime: number = 0;
  private cells: Matrix<number>;
  private animationFrameRequestId: number;
  private _evolving: boolean;
  public renderCellFunction: (x: number, y: number) => void;
  public interval: number = 150;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.cells = new Matrix<number>(100, 100);
    this.renderCellFunction = this.renderSquares;
  }

  get context() {
    return this.canvas.getContext('2d')
  }

  get evolving() {
    return this._evolving;
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
    this._evolving = true;
  }

  stopEvolving() {
    this._evolving = false;
  }

  toggleEvolving() {
    this._evolving = !this._evolving;
  }

  clear() {
    this.cells = new Matrix<number>(this.cells.width, this.cells.height);
  }

  loop() {
    this.render();

    if (this._evolving && performance.now() > this.lastStepTime + this.interval) {
      this.lastStepTime = performance.now();
      this.nextStep();
    }

    this.animationFrameRequestId = requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderGrid();
    this.renderCells();

    // this.renderInterval();
  }

  renderGrid() {
    this.context.save();

    this.context.strokeStyle = 'lightgray';
    this.context.lineWidth = 1;

    for (let x = 0; x < this.cells.width; x++) {
      for (let y = 0; y < this.cells.height; y++) {
        this.context.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }

    this.context.restore();
  }

  renderCells() {
    this.context.strokeStyle = 'black';

    for (let x = 0; x < this.cells.width; x++) {
      for (let y = 0; y < this.cells.height; y++) {
        const value = this.cells.getValue(x, y);
        if (value) {
          this.renderCellFunction(x, y);
        }
      }
    }
  }

  renderSquares(x: number, y: number) {
    this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
  }

  renderCircles(x: number, y: number) {
    this.context.beginPath();
    this.context.arc((x+1/2) * this.cellSize, (y+1/2) * this.cellSize, this.cellSize / 2, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
  }

  renderLines(x: number, y: number, offset: number, lineWidth: number) {
    this.context.save();
    this.context.lineWidth = lineWidth;

    for (let xx = x - offset; xx < x + offset + 1; xx++) {
      for (let yy = y - offset; yy < y + offset + 1; yy++) {
        if (!this.cells.isInBounds(xx, yy))
          continue;
        if (!this.cells.getValue(xx, yy))
          continue;
        this.context.beginPath();
        this.context.moveTo((x + 1/2) * this.cellSize, (y + 1/2) * this.cellSize);
        this.context.lineTo((xx + 1/2) * this.cellSize, (yy + 1/2) * this.cellSize);
        this.context.closePath();
        this.context.stroke();
      }
    }

    this.context.restore();

  }

  renderLines1(x: number, y: number) {
    this.renderLines(x, y, 1, 1);
  }

  renderLines2(x: number, y: number) {
    this.renderLines(x, y, 2, 1);
    this.renderLines(x, y, 1, 2);
  }


  renderInterval() {

    this.context.save();

    this.context.font = '48px sans-serif';
    this.context.textBaseline = 'top';
    this.context.fillStyle = 'white';
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;

    this.context.fillText('Interval: ' + this.interval, 12, 12);
    this.context.strokeText('Interval: ' + this.interval, 12, 12);

    this.context.restore();
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

  pasteBiClock(x: number, y: number, rotation: number): void {
    this.cells.paste(Patterns.biClock.rotate(rotation), x, y);
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