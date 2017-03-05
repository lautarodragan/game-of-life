import { GameOfLife } from './GameOfLife';

declare global {
  interface Window {
    gameOfLife: GameOfLife;
    canvas: HTMLCanvasElement;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.querySelector('canvas');
  const startStop = document.querySelector('#start-stop');

  const gameOfLife = new GameOfLife(canvas);

  startStop.addEventListener('click', onStartStop);
  document.querySelector('#clear').addEventListener('click', gameOfLife.clear.bind(gameOfLife));
  document.querySelector('#next-step').addEventListener('click', event => gameOfLife.nextStep());
  document.querySelector('#add-glider').addEventListener('click', event => gameOfLife.pasteGlider(10, 10, 0));
  document.querySelector('#add-lightweight-spaceship').addEventListener('click', event => gameOfLife.pasteLightweightSpaceship(10, 10, 0));
  document.querySelector('#add-bi-clock').addEventListener('click', event => gameOfLife.pasteBiClock(10, 10, 1));

  function onStartStop() {
    gameOfLife.toggleEvolving();
    startStop.innerHTML = gameOfLife.evolving ? 'Stop' : 'Start';
  }

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log(event.key);
    switch (event.key) {
      case ' ':
        onStartStop();
        break;
      case 'Enter':
        gameOfLife.nextStep();
        break;
      case 'Delete':
        gameOfLife.clear();
        break;
      case 'ArrowRight':
        gameOfLife.interval = Math.max(0, gameOfLife.interval - 50);
        break;
      case 'ArrowLeft':
        gameOfLife.interval += 50;
        break;
      case '1':
        gameOfLife.pasteGlider(10, 10, 0);
        break;
      case '2':
        gameOfLife.pasteLightweightSpaceship(10, 10, 0);
        break;
      case '3':
        gameOfLife.pasteBiClock(10, 10, 0);
        break;

      case 'q':
        gameOfLife.renderCellFunction = gameOfLife.renderSquares;
        break;
      case 'w':
        gameOfLife.renderCellFunction = gameOfLife.renderCircles;
        break;
      case 'e':
        gameOfLife.renderCellFunction = gameOfLife.renderLines1;
        break;
      case 'r':
        gameOfLife.renderCellFunction = gameOfLife.renderLines2;
        break;

      case 'a':
        gameOfLife.renderClearFunction = gameOfLife.renderClearPlain;
        break;
      case 's':
        gameOfLife.renderClearFunction = gameOfLife.renderClearFadeWhite;
        break;
      case 'd':
        gameOfLife.renderClearFunction = gameOfLife.renderClearFadeColors;
        break;

      case 'z':
        gameOfLife.renderCellColorFunction = gameOfLife.renderCellColorBlack;
        break;
      case 'x':
        gameOfLife.renderCellColorFunction = gameOfLife.renderCellColorRandom;
        break;
    }
  });

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  gameOfLife.startRendering();
  gameOfLife.startEvolving();

  window.gameOfLife = gameOfLife;
  window.canvas = canvas;

  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });

  const audio = new Audio('audio_file.mp3');
  audio.play();


});
