export class Matrix<T> {
  private cells: T[][];
  private _height: number;
  private _width: number;

  constructor(width: number, height: number, data?: T[][]) {
    if (data) {
      this.cells = data;
      this._width = width;
      this._height = height;
    } else {
      this.initialize(width, height);
    }

  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  initialize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.cells = [];
    for (let x = 0; x < this._width; x++) {
      this.cells[x] = [];
      this.cells[x].length = this._height;
      for (let y = 0; y < this._height; y++) {
        this.cells[x][y] = null;
      }
    }
  }

  getValue(x: number, y: number): T {
    return this.cells[x][y];
  }

  setValue(x: number, y: number, value: T): void {
    this.cells[x][y] = value;
  }

  paste(matrix: Matrix<T>, dx: number = 0, dy: number = 0): void {
    for (let x = 0; x < matrix._width; x++) {
      for (let y = 0; y < matrix._height; y++) {
        this.cells[dx + x][dy + y] = matrix.getValue(x, y);
      }
    }
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this._width && y < this._height;
  }

  rotate(amount: number): Matrix<T> {
    const newWidth = amount % 2 === 0 ? this._width : this._height;
    const newHeight = amount % 2 === 0 ? this._height : this._width;
    const matrix = new Matrix<T>(newWidth, newHeight)
      ;
    for (let x = 0; x < this._width; x++)
      for (let y = 0; y < this._height; y++)
        if (amount === 0)
          matrix.setValue(x, y, this.getValue(x, y));
        else if (amount === 1)
          matrix.setValue(y, this._width - 1 - x, this.getValue(x, y));
        else if (amount === 2)
          matrix.setValue(this._width - 1 - x, this._height - 1 - y, this.getValue(x, y));
        else if (amount === 3)
          matrix.setValue(this._height - 1 - y, x, this.getValue(x, y));
    return matrix;
  }
}