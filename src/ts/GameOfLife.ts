import { Matrix } from './Matrix';

export class GameOfLife {
  private canvas: HTMLCanvasElement;
  private step: number;
  private cellSize: number = 16;
  private lastStepTime: number = 0;
  private cells: Matrix<number>;
  private animationFrameRequestId: number;
  private _evolving: boolean;
  public renderCellFunction: (x: number, y: number) => void;
  public renderClearFunction: () => void;
  public renderCellColorFunction: () => void;
  public interval: number = 150;
  public gridVisible: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.cells = new Matrix<number>(100, 100);
    this.renderCellFunction = this.renderSquares;
    this.renderClearFunction = this.renderClearPlainWhite;
    this.renderCellColorFunction = this.renderCellColorBlack;
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
    this.renderClearFunction();

    if (this.gridVisible)
      this.renderGrid();

    this.renderCells();

  }

  renderClearPlainWhite() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderClearPlainBlack() {
    this.context.save();
    this.context.fillStyle = `black`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  renderClearFadeWhite() {
    this.context.save();
    this.context.fillStyle = `rgba(255, 255, 255, 0.03)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  renderClearFadeBlack() {
    this.context.save();
    this.context.fillStyle = `rgba(0, 0, 0, 0.03)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  renderClearFadeColors() {
    this.context.save();
    this.context.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.03)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
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
    this.renderCellColorFunction();

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

  renderCellColorBlack() {
    this.context.strokeStyle = `black`;
    this.context.fillStyle = `black`;
  }

  renderCellColorRandom() {
    const lightest = 200;
    this.context.strokeStyle = `rgb(${Math.floor(Math.random() * lightest)}, ${Math.floor(Math.random() * lightest)}, ${Math.floor(Math.random() * lightest)})`;
    this.context.fillStyle = `rgb(${Math.floor(Math.random() * lightest)}, ${Math.floor(Math.random() * lightest)}, ${Math.floor(Math.random() * lightest)})`;
  }

  renderLines1(x: number, y: number) {
    this.renderLines(x, y, 1, 1);
  }

  renderLines2(x: number, y: number) {
    this.renderLines(x, y, 2, 1);
    this.renderLines(x, y, 1, 2);
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

  pastePattern(pattern: Matrix<number>, x: number, y: number): void {
    this.cells.paste(pattern, x, y);
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