import * as React from 'react';
import { Matrix } from '../Matrix';
import { Patterns } from '../Patterns';

interface ControlsProps {
  readonly isEvolving: boolean;
  readonly onPastePattern: (pattern: Matrix<number>) => void;
  readonly onNextStep: () => void;
  readonly onStartStop: () => void;
  readonly onClear: () => void;
}

export class Controls extends React.Component<ControlsProps, undefined> {
  render() {
    return (
      <section className="controls-overlay">
        <nav className="patterns">
          <button onClick={() => this.props.onPastePattern(Patterns.glider)}>Glider</button>
          <button onClick={() => this.props.onPastePattern(Patterns.lightweightSpaceship)}>Lightweight Spaceship</button>
          <button onClick={() => this.props.onPastePattern(Patterns.biClock)}>Bi-Clock</button>
        </nav>
        <nav className="controls">
          <button onClick={this.props.onNextStep}>Next Step</button>
          <button onClick={this.props.onStartStop}>{ this.props.isEvolving ? 'Pause' : 'Unpause'}</button>
          <button onClick={this.props.onClear}>Clear</button>
        </nav>
      </section>
    );
  }
}