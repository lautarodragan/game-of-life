import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

import { GameOfLife } from './GameOfLife';
import { Controls } from './components/Controls';
import { Keyboard } from "./components/Keyboard";
import { Matrix } from "./Matrix";
import { RenderModes } from "./RenderModes";

interface ApplicationState {
  readonly isEvolving: boolean;
  readonly mouseMoved: boolean;
}

class Application extends React.Component<undefined, ApplicationState> {
  private readonly width = 400;
  private readonly height = 400;
  private canvas: HTMLCanvasElement;
  private gameOfLife: GameOfLife;
  private mouseMoveTimer: number;

  constructor() {
    super();
    this.onResize = this.onResize.bind(this);
    this.state = {
      isEvolving: false,
      mouseMoved: false
    }
  }

  render() {
    return (
      <section className={classNames('application', this.state.mouseMoved && 'mouse-moved')} onMouseMove={this.onMouseMove.bind(this)}>
        <Controls
          isEvolving={this.state.isEvolving}
          onPastePattern={this.onPastePattern.bind(this)}
          onStartStop={() => this.toggleEvolving()}
          onNextStep={() => this.gameOfLife.nextStep()}
          onClear={() => this.gameOfLife.clear()}
        />
        <Keyboard
          onToggleEvolving={() => this.toggleEvolving()}
          onNextStep={() => this.gameOfLife.nextStep()}
          onClear={() => this.gameOfLife.clear()}
          onEvolveFaster={() => this.gameOfLife.interval = Math.max(0, this.gameOfLife.interval - 50)}
          onEvolveSlower={() => this.gameOfLife.interval += 50}
          onPattern={this.onPastePattern.bind(this)}
          onRenderCellShape={this.onRenderCellShape.bind(this)}
          onRenderClear={this.onRenderClear.bind(this)}
          onRenderCellColor={this.onRenderCellColor.bind(this)}
          onCellSize={(cellSize: number) => this.gameOfLife.cellSize = cellSize}
        />
        <canvas ref={canvas => this.canvas = canvas} tabIndex={0} />
      </section>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.updateCanvasSize();
    this.gameOfLife = new GameOfLife(this.canvas, this.width, this.height);
    this.gameOfLife.startRendering();
    this.gameOfLife.startEvolving();
    this.setState({ isEvolving: true })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  private onMouseMove() {
    if (this.mouseMoveTimer) {
      clearTimeout(this.mouseMoveTimer);
    } else {
      if (!this.state.mouseMoved)
        this.setState({ mouseMoved: true })
    }

    this.mouseMoveTimer = setTimeout(() => {
      this.setState({ mouseMoved: false })
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

  onPastePattern(pattern: Matrix<number>) {
    this.gameOfLife.pastePattern(pattern.rotate(Math.floor(Math.random() * 4)), Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height))
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
