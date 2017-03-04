import { Matrix } from './Matrix';

export namespace Patterns {

  export const glider = new Matrix(3, 3, [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
  ]);

  export const lightweightSpaceship = new Matrix(4, 5, [
    [0,1,1,0,0],
    [1,1,1,1,0],
    [1,1,0,1,1],
    [0,0,1,1,0],
  ]);

}
