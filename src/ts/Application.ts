import { GameOfLife } from './GameOfLife';

declare global {
  interface Window {
    gameOfLife: GameOfLife;
    canvas: HTMLCanvasElement;
  }

}

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.querySelector('canvas');
  const gameOfLife = new GameOfLife(canvas);

  document.querySelector('#start').addEventListener('click', gameOfLife.startEvolving.bind(gameOfLife));
  document.querySelector('#stop').addEventListener('click', gameOfLife.stopEvolving.bind(gameOfLife));
  document.querySelector('#clear').addEventListener('click', gameOfLife.clear.bind(gameOfLife));
  document.querySelector('#next-step').addEventListener('click', event => gameOfLife.nextStep());
  document.querySelector('.interval input').addEventListener('change', (event: any) => gameOfLife.stepInterval = parseInt(event.target.value));
  document.querySelector('.interval input').addEventListener('keyup', (event: any) => gameOfLife.stepInterval = parseInt(event.target.value));
  document.querySelector('#add-glider').addEventListener('click', event => gameOfLife.pasteGlider(10, 10, 0));
  document.querySelector('#add-lightweight-spaceship').addEventListener('click', event => gameOfLife.pasteLightweightSpaceship(10, 10, 0));
  document.querySelector('#add-bi-clock').addEventListener('click', event => gameOfLife.pasteBiClock(10, 10, 1));

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  gameOfLife.startRendering();

  window.gameOfLife = gameOfLife;
  window.canvas = canvas;
});
