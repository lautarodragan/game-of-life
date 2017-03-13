import * as React from 'react';
import * as classNames from 'classnames';

import { Matrix } from '../Matrix';
import { Patterns } from '../Patterns';
import { RenderModes } from '../RenderModes';

interface ControlsProps {
  readonly isEvolving: boolean;
  readonly onPastePattern: (pattern: Matrix<number>) => void;
  readonly onNextStep: () => void;
  readonly onStartStop: () => void;
  readonly onClear: () => void;
  readonly onEvolveFaster: () => void;
  readonly onEvolveSlower: () => void;
  readonly onResize: (size: number) => void;
  readonly onCellSize: (cellSize: number) => void;
  readonly onRenderCellShape: (renderCellMode: RenderModes.CellShape) => void;
  readonly onRenderCellColor: (renderCellMode: RenderModes.CellColor) => void;
  readonly onRenderClear: (renderCellMode: RenderModes.Clear) => void;
}

export class Controls extends React.Component<ControlsProps, undefined> {
  render() {
    return (
      <section className="controls-overlay">
        <div className="top">
          <nav className="left">
            <ButtonWithShortcut onClick={() => this.props.onPastePattern(Patterns.glider)} label="Glider" shortcut="1"/>
            <ButtonWithShortcut onClick={() => this.props.onPastePattern(Patterns.lightweightSpaceship)} label="Lightweight Spaceship" shortcut="2"/>
            <ButtonWithShortcut onClick={() => this.props.onPastePattern(Patterns.biClock)} label="Bi-Clock" shortcut="3"/>
          </nav>
          <nav className="right">
            <ButtonWithShortcut onClick={this.props.onEvolveSlower} label="Slower" shortcut="←"/>
            <ButtonWithShortcut onClick={this.props.onEvolveFaster} label="Faster" shortcut="→"/>
            <ButtonWithShortcut onClick={this.props.onNextStep} label="Next Step" shortcut="Enter"/>
            <ButtonWithShortcut onClick={this.props.onStartStop} label={ this.props.isEvolving ? 'Pause' : 'Unpause'} shortcut="Space"/>
            <ButtonWithShortcut onClick={this.props.onClear} label="Clear" shortcut="Delete"/>
          </nav>
        </div>
        <div className="bottom">
          <nav className="left">
            <ButtonWithDropdown label="Cell Shape" className="dropdown" >
              <ButtonWithShortcut onClick={() => this.props.onRenderCellShape(RenderModes.CellShape.Squares)} label="Squares" shortcut="q"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderCellShape(RenderModes.CellShape.Circles)} label="Circles" shortcut="w"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderCellShape(RenderModes.CellShape.Lines1)} label="Lines1" shortcut="e"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderCellShape(RenderModes.CellShape.Lines2)} label="Lines2" shortcut="r"/>
            </ButtonWithDropdown>
            <ButtonWithDropdown label="Cell Color" className="dropdown" >
              <ButtonWithShortcut onClick={() => this.props.onRenderCellColor(RenderModes.CellColor.Black)} label="Black" shortcut="z"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderCellColor(RenderModes.CellColor.White)} label="White" shortcut="x"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderCellColor(RenderModes.CellColor.Random)} label="Random" shortcut="c"/>
            </ButtonWithDropdown>
            <ButtonWithDropdown label="Clear Mode" className="dropdown" >
              <ButtonWithShortcut onClick={() => this.props.onRenderClear(RenderModes.Clear.PlainWhite)} label="Plain White" shortcut="a"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderClear(RenderModes.Clear.PlainBlack)} label="Plain Black" shortcut="s"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderClear(RenderModes.Clear.FadeWhite)} label="Fade White" shortcut="d"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderClear(RenderModes.Clear.FadeBlack)} label="Fade Black" shortcut="f"/>
              <ButtonWithShortcut onClick={() => this.props.onRenderClear(RenderModes.Clear.Random)} label="Random" shortcut="g"/>
            </ButtonWithDropdown>
          </nav>
          <nav className="right">
            <ButtonWithDropdown label="Cell Size" className="dropdown" >
              <ButtonWithShortcut onClick={() => this.props.onCellSize(1)} label="1" shortcut="y"/>
              <ButtonWithShortcut onClick={() => this.props.onCellSize(2)} label="2" shortcut="u"/>
              <ButtonWithShortcut onClick={() => this.props.onCellSize(4)} label="4" shortcut="i"/>
              <ButtonWithShortcut onClick={() => this.props.onCellSize(8)} label="8" shortcut="o"/>
              <ButtonWithShortcut onClick={() => this.props.onCellSize(16)} label="16" shortcut="p"/>
            </ButtonWithDropdown>
            <ButtonWithDropdown label="Board Size" className="dropdown" >
              <ButtonWithShortcut onClick={() => this.props.onResize(100)} label="100x100" shortcut="b"/>
              <ButtonWithShortcut onClick={() => this.props.onResize(200)} label="200x200" shortcut="n"/>
              <ButtonWithShortcut onClick={() => this.props.onResize(400)} label="400x400" shortcut="m"/>
            </ButtonWithDropdown>
          </nav>
        </div>
      </section>
    );
  }
}

interface ButtonWithShortcutProps {
  readonly label: string;
  readonly shortcut: string;
  readonly onClick: () => void;
  readonly className?: string;
}

function ButtonWithShortcut(props: ButtonWithShortcutProps) {
  return (
    <button onClick={props.onClick} className={props.className} >
      <label>{props.label}</label>
      { props.shortcut && <small>{props.shortcut}</small> }
    </button>
  )
}

interface ButtonWithDropdownProps {
  readonly label: string;
  readonly shortcut?: string;
  readonly className?: string;
  readonly openClassName?: string;
  readonly wrapperClassName?: string;
}

interface ButtonWithDropdownState {
  readonly isOpen: boolean;
}

class ButtonWithDropdown extends React.Component<ButtonWithDropdownProps, ButtonWithDropdownState> {

  static defaultProps = {
    openClassName: 'open',
    wrapperClassName: 'wrapper'
  };

  constructor(props: ButtonWithDropdownProps) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  render() {
    return (
      <section className={classNames(this.props.className, this.state.isOpen && this.props.openClassName)} >
        <ButtonWithShortcut
          className="trigger"
          label={this.props.label}
          shortcut={this.props.shortcut}
          onClick={() => this.setState(state => ({ isOpen: !state.isOpen }))}
        />
        { this.props.children }
      </section>
    )
  }

}