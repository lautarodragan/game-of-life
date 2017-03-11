import * as React from 'react';

interface WindowResizeProps {
  onResize: () => void;
}

export class WindowResize extends React.Component<WindowResizeProps, undefined> {

  constructor(props: WindowResizeProps) {
    super(props);
    this.onResize = this.onResize.bind(this);
  }

  render(): null {
    return null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize() {
    this.props.onResize();
  }

}