import * as React from 'react';
import { Matrix } from "../Matrix";
import { Patterns } from "../Patterns";
import { RenderModes } from "../RenderModes";

export interface KeyboardProps {
  readonly onToggleEvolving: () => void;
  readonly onNextStep: () => void;
  readonly onClear: () => void;
  readonly onPattern: (pattern: Matrix<number>) => void;
  readonly onCellSize: (cellSize: number) => void;
  readonly onEvolveFaster: () => void;
  readonly onEvolveSlower: () => void;
  readonly onRenderCellShape: (renderCellMode: RenderModes.CellShape) => void;
  readonly onRenderClear: (renderCellMode: RenderModes.Clear) => void;
  readonly onRenderCellColor: (renderCellMode: RenderModes.CellColor) => void;
}

export class Keyboard extends React.Component<KeyboardProps, undefined> {

  constructor() {
    super();
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  render(): null { return null }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
        this.props.onToggleEvolving();
        break;
      case 'Enter':
        this.props.onNextStep();
        break;

      case 'Delete':
      case 'Backspace':
        this.props.onClear();
        break;

      case 'ArrowRight':
        this.props.onEvolveFaster();
        break;
      case 'ArrowLeft':
        this.props.onEvolveSlower();
        break;

      case '1':
        this.props.onPattern(Patterns.glider);
        break;
      case '2':
        this.props.onPattern(Patterns.lightweightSpaceship);
        break;
      case '3':
        this.props.onPattern(Patterns.biClock);
        break;

      case 'q':
        this.props.onRenderCellShape(RenderModes.CellShape.Squares);
        break;
      case 'w':
        this.props.onRenderCellShape(RenderModes.CellShape.Circles);
        break;
      case 'e':
        this.props.onRenderCellShape(RenderModes.CellShape.Lines1);
        break;
      case 'r':
        this.props.onRenderCellShape(RenderModes.CellShape.Lines2);
        break;

      case 'a':
        this.props.onRenderClear(RenderModes.Clear.PlainWhite);
        break;
      case 's':
        this.props.onRenderClear(RenderModes.Clear.PlainBlack);
        break;
      case 'd':
        this.props.onRenderClear(RenderModes.Clear.FadeWhite);
        break;
      case 'f':
        this.props.onRenderClear(RenderModes.Clear.FadeBlack);
        break;
      case 'g':
        this.props.onRenderClear(RenderModes.Clear.Random);
        break;

      case 'z':
        this.props.onRenderCellColor(RenderModes.CellColor.Black);
        break;
      case 'x':
        this.props.onRenderCellColor(RenderModes.CellColor.White);
        break;
      case 'c':
        this.props.onRenderCellColor(RenderModes.CellColor.Random);
        break;

      case 'y':
        this.props.onCellSize(1);
        break;
      case 'u':
        this.props.onCellSize(2);
        break;
      case 'i':
        this.props.onCellSize(4);
        break;
      case 'o':
        this.props.onCellSize(8);
        break;
      case 'p':
        this.props.onCellSize(16);
        break;
    }
  }
}