import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';

export const SCROLL_UP = 'up';
export const SCROLL_DOWN = 'down';

function withScrollDirection(config = { initializedDirection: SCROLL_UP }) {
  return function wrapWithScrollDirection(ComposedComponent) {
    class WithScrollDirection extends Component {
      constructor() {
        super();
        this.state = {
          scrollDirection: config.initializedDirection,
        };
      }
      componentDidMount() {
        this.ticking = false;
        this.prevScroll = window.scrollY;
        window.addEventListener('scroll', this.onScroll);
      }

      componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
      }

      onScroll = e => {
        if (!this.ticking) {
          window.requestAnimationFrame(this.handleScroll);
          this.ticking = true;
        }
      };

      handleScroll = () => {
        const currScroll = window.scrollY;
        const { scrollDirection } = this.state;

        if (this.prevScroll > currScroll && scrollDirection !== SCROLL_UP) {
          this.setState({ scrollDirection: SCROLL_UP });
        } else if (
          this.prevScroll < currScroll &&
          scrollDirection !== SCROLL_DOWN
        ) {
          this.setState({ scrollDirection: SCROLL_DOWN });
        }
        this.prevScroll = currScroll;
        this.ticking = false;
      };

      render() {
        const { scrollDirection } = this.state;
        return (
          <ComposedComponent
            {...this.props}
            scrollDirection={scrollDirection}
          />
        );
      }
    }

    const displayName =
      ComposedComponent.displayName || ComposedComponent.name || 'Component';

    WithScrollDirection.displayName = `WithScrollDirection(${displayName})`;

    return hoistStatics(WithScrollDirection, ComposedComponent);
  };
}
export default withScrollDirection;
