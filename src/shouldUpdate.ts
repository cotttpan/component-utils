import { Component, h, ComponentConstructor, AnyComponent } from 'preact'
import { getDisplayName } from './getDisplayName'

export namespace shouldUpdate {
    export interface Enhancer<P> {
      (BaseComponent: AnyComponent<P, any>): ComponentConstructor<P, any>
    }
}

export function shouldUpdate<P>(
    test: (props: P, nextProps: P) => boolean,
): shouldUpdate.Enhancer<P> {
  return function enhance(BaseComponent: AnyComponent<P, any>) {
    return class ShouldUpdate extends Component<any, any> {
      static displayName = `shouldUpdate(${getDisplayName(BaseComponent)})`

      shouldComponentUpdate(nextProps: any) {
        return test(this.props, nextProps)
      }
      render() {
        return h(BaseComponent, { ...this.props })
      }
    }
  }
}
