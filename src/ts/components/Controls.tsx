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
          <ButtonWithShortcut onClick={() => this.props.onPastePattern(Patterns.glider)} label="Glider" shortcut="1"/>
          <ButtonWithShortcut onClick={() => this.props.onPastePattern(Patterns.lightweightSpaceship)} label="Lightweight Spaceship" shortcut="2"/>
          <ButtonWithShortcut onClick={() => this.props.onPastePattern(Patterns.biClock)} label="Bi-Clock" shortcut="3"/>
        </nav>
        <nav className="controls">
          <ButtonWithShortcut onClick={this.props.onNextStep} label="Next Step" shortcut="Enter"/>
          <ButtonWithShortcut onClick={this.props.onStartStop} label={ this.props.isEvolving ? 'Pause' : 'Unpause'} shortcut="Space"/>
          <ButtonWithShortcut onClick={this.props.onClear} label="Clear" shortcut="Delete"/>
        </nav>
      </section>
    );
  }
}

interface ButtonWithShortcutProps {
  readonly label: string;
  readonly shortcut: string;
  readonly onClick: () => void;
}

function ButtonWithShortcut(props: ButtonWithShortcutProps) {
  return (
    <button onClick={props.onClick}>
      <label>{props.label}</label>
      <small>{props.shortcut}</small>
    </button>
  )
}