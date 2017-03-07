import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { GameOfLife } from './GameOfLife';
import { Controls } from './components/Controls';
import { Patterns } from './Patterns';

interface ApplicationState {
  readonly isEvolving: boolean;
}

class Application extends React.Component<undefined, ApplicationState> {
  private canvas: HTMLCanvasElement;
  private readonly width = 400;
  private readonly height = 400;
  private gameOfLife: GameOfLife;

  constructor() {
    super();
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.state = {
      isEvolving: false
    }
  }

  render() {
    return (
      <div>
        <Controls
          isEvolving={this.state.isEvolving}
          onPastePattern={(pattern) => this.gameOfLife.pastePattern(pattern, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height))}
          onStartStop={() => this.toggleEvolving()}
          onNextStep={() => this.gameOfLife.nextStep()}
          onClear={() => this.gameOfLife.clear()}
        />
        <canvas ref={canvas => this.canvas = canvas} tabIndex={0} />
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    document.addEventListener('keydown', this.onKeyDown);
    this.updateCanvasSize();
    this.gameOfLife = new GameOfLife(this.canvas, this.width, this.height);
    this.gameOfLife.startRendering();
    this.gameOfLife.startEvolving();
    this.setState({ isEvolving: true })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private updateCanvasSize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  private onResize() {
    this.updateCanvasSize();
  }

  private onKeyDown(event: KeyboardEvent) {
    console.log(event.key);
    switch (event.key) {
      case ' ':
        this.toggleEvolving();
        break;
      case 'Enter':
        this.gameOfLife.nextStep();
        break;

      case 'Delete':
      case 'Backspace':
        this.gameOfLife.clear();
        break;

      case 'ArrowRight':
        this.gameOfLife.interval = Math.max(0, this.gameOfLife.interval - 50);
        break;
      case 'ArrowLeft':
        this.gameOfLife.interval += 50;
        break;

      case '1':
        this.gameOfLife.pastePattern(Patterns.glider, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
        break;
      case '2':
        this.gameOfLife.pastePattern(Patterns.lightweightSpaceship, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
        break;
      case '3':
        this.gameOfLife.pastePattern(Patterns.biClock, Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
        break;

      case 'q':
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderSquares;
        break;
      case 'w':
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderCircles;
        break;
      case 'e':
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderLines1;
        break;
      case 'r':
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderLines2;
        break;

      case 'a':
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearPlainWhite;
        break;
      case 's':
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearPlainBlack;
        break;
      case 'd':
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearFadeWhite;
        break;
      case 'f':
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearFadeBlack;
        break;
      case 'g':
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearFadeColors;
        break;

      case 'z':
        this.gameOfLife.renderCellColorFunction = this.gameOfLife.renderCellColorBlack;
        break;
      case 'x':
        this.gameOfLife.renderCellColorFunction = this.gameOfLife.renderCellColorWhite;
        break;
      case 'c':
        this.gameOfLife.renderCellColorFunction = this.gameOfLife.renderCellColorRandom;
        break;

      case 'y':
        this.gameOfLife.cellSize = 1;
        break;
      case 'u':
        this.gameOfLife.cellSize = 2;
        break;
      case 'i':
        this.gameOfLife.cellSize = 4;
        break;
      case 'o':
        this.gameOfLife.cellSize = 8;
        break;
      case 'p':
        this.gameOfLife.cellSize = 16;
        break;
    }
  }

  private toggleEvolving() {
    this.gameOfLife.toggleEvolving();
    this.setState({ isEvolving: this.gameOfLife.evolving });
  }
}

ReactDOM.render(<Application/>, document.getElementById('react-root'));
