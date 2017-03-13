import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

import { GameOfLife } from './GameOfLife';
import { Controls } from './components/Controls';
import { Keyboard } from "./components/Keyboard";
import { Matrix } from "./Matrix";
import { RenderModes } from "./RenderModes";
import { WindowResize } from './components/WindowResize';

import '../Application.scss';

interface ApplicationState {
  readonly isEvolving: boolean;
  readonly mouseMoved: boolean;
}

class Application extends React.Component<undefined, ApplicationState> {
  private canvas: HTMLCanvasElement;
  private gameOfLife: GameOfLife;
  private mouseMoveTimer: number;

  constructor() {
    super();
    this.state = {
      isEvolving: false,
      mouseMoved: false
    }
  }

  render() {
    return (
      <section className={classNames('application', this.state.mouseMoved && 'mouse-moved')} onMouseMove={this.onMouseMove.bind(this)}>
        <WindowResize onResize={this.onResize.bind(this)} />
        <Controls
          isEvolving={this.state.isEvolving}
          onPastePattern={this.onPastePattern.bind(this)}
          onStartStop={() => this.toggleEvolving()}
          onNextStep={() => this.gameOfLife.nextStep()}
          onClear={() => this.gameOfLife.clear()}
          onEvolveFaster={this.onEvolveFaster.bind(this)}
          onEvolveSlower={this.onEvolveSlower.bind(this)}
          onResize={size => this.gameOfLife.resize(size, size)}
          onCellSize={(cellSize: number) => this.gameOfLife.cellSize = cellSize}
          onRenderCellShape={this.onRenderCellShape.bind(this)}
          onRenderCellColor={this.onRenderCellColor.bind(this)}
          onRenderClear={this.onRenderClear.bind(this)}
        />
        <Keyboard
          onToggleEvolving={() => this.toggleEvolving()}
          onNextStep={() => this.gameOfLife.nextStep()}
          onClear={() => this.gameOfLife.clear()}
          onEvolveFaster={this.onEvolveFaster.bind(this)}
          onEvolveSlower={this.onEvolveSlower.bind(this)}
          onPattern={this.onPastePattern.bind(this)}
          onRenderCellShape={this.onRenderCellShape.bind(this)}
          onRenderClear={this.onRenderClear.bind(this)}
          onRenderCellColor={this.onRenderCellColor.bind(this)}
          onCellSize={(cellSize: number) => this.gameOfLife.cellSize = cellSize}
          onResize={size => this.gameOfLife.resize(size, size)}
        />
        <canvas ref={canvas => this.canvas = canvas} tabIndex={0} />
      </section>
    )
  }

  componentDidMount() {
    this.updateCanvasSize();
    this.gameOfLife = new GameOfLife(this.canvas, 100, 100);
    this.gameOfLife.startRendering();
    this.gameOfLife.startEvolving();
    this.setState({ isEvolving: true })
  }

  private onMouseMove() {
    if (this.mouseMoveTimer) {
      clearTimeout(this.mouseMoveTimer);
    } else {
      if (!this.state.mouseMoved)
        this.setState({ mouseMoved: true })
    }

    this.mouseMoveTimer = setTimeout(() => {
      this.setState({ mouseMoved: false });
      this.mouseMoveTimer = null;
    }, 2000);

  }

  private updateCanvasSize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  private onResize() {
    this.updateCanvasSize();
  }

  private onPastePattern(pattern: Matrix<number>) {
    this.gameOfLife.pastePattern(pattern.rotate(Math.floor(Math.random() * 4)), Math.floor(Math.random() * this.gameOfLife.width), Math.floor(Math.random() * this.gameOfLife.height))
  }

  private onEvolveFaster() {
    this.gameOfLife.interval = Math.max(0, this.gameOfLife.interval - 50)
  }

  private onEvolveSlower() {
    this.gameOfLife.interval += 50
  }

  private onRenderCellShape(renderCellMode: RenderModes.CellShape) {
    switch (renderCellMode) {
      case RenderModes.CellShape.Squares:
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderSquares;
        break;
      case RenderModes.CellShape.Circles:
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderCircles;
        break;
      case RenderModes.CellShape.Lines1:
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderLines1;
        break;
      case RenderModes.CellShape.Lines2:
        this.gameOfLife.renderCellFunction = this.gameOfLife.renderLines2;
        break;
    }
  }

  private onRenderClear(renderCellMode: RenderModes.Clear) {
    switch (renderCellMode) {
      case RenderModes.Clear.PlainWhite:
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearPlainWhite;
        break;
      case RenderModes.Clear.PlainBlack:
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearPlainBlack;
        break;
      case RenderModes.Clear.FadeWhite:
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearFadeWhite;
        break;
      case RenderModes.Clear.FadeBlack:
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearFadeBlack;
        break;
      case RenderModes.Clear.Random:
        this.gameOfLife.renderClearFunction = this.gameOfLife.renderClearFadeColors;
        break;
    }
  }

  private onRenderCellColor(renderCellMode: RenderModes.CellColor) {
    switch (renderCellMode) {
      case RenderModes.CellColor.Black:
        this.gameOfLife.renderCellColorFunction = this.gameOfLife.renderCellColorBlack;
        break;
      case RenderModes.CellColor.White:
        this.gameOfLife.renderCellColorFunction = this.gameOfLife.renderCellColorWhite;
        break;
      case RenderModes.CellColor.Random:
        this.gameOfLife.renderCellColorFunction = this.gameOfLife.renderCellColorRandom;
        break;
    }
  }

  private toggleEvolving() {
    this.gameOfLife.toggleEvolving();
    this.setState({ isEvolving: this.gameOfLife.evolving });
  }
}

ReactDOM.render(<Application/>, document.getElementById('react-root'));
