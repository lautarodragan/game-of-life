export class Matrix<T> {
  private readonly cells: T[][];
  public readonly height: number;
  public readonly width: number;

  constructor(width: number, height: number, data?: T[][]) {
    this.width = width;
    this.height = height;
    if (data) {
      this.cells = data;
    } else {
      this.cells = [];
      this.initialize();
    }
  }

  initialize() {
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      this.cells[x].length = this.height;
      for (let y = 0; y < this.height; y++) {
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
    for (let x = 0; x < matrix.width; x++) {
      for (let y = 0; y < matrix.height; y++) {
        if (!this.isInBounds(dx + x, dy + y))
          continue;
        this.cells[dx + x][dy + y] = matrix.getValue(x, y);
      }
    }
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  rotate(amount: number): Matrix<T> {
    const newWidth = amount % 2 === 0 ? this.width : this.height;
    const newHeight = amount % 2 === 0 ? this.height : this.width;
    const matrix = new Matrix<T>(newWidth, newHeight);

    for (let x = 0; x < this.width; x++)
      for (let y = 0; y < this.height; y++)
        if (amount === 0)
          matrix.setValue(x, y, this.getValue(x, y));
        else if (amount === 1)
          matrix.setValue(y, this.width - 1 - x, this.getValue(x, y));
        else if (amount === 2)
          matrix.setValue(this.width - 1 - x, this.height - 1 - y, this.getValue(x, y));
        else if (amount === 3)
          matrix.setValue(this.height - 1 - y, x, this.getValue(x, y));
    return matrix;
  }

  resize(width: number, height: number): Matrix<T> {
    const matrix = new Matrix<T>(width, height);
    matrix.paste(this);
    return matrix;
  }
}