import { Component, h, AnyComponent, ComponentConstructor } from 'preact'
import { getDisplayName } from './getDisplayName'

export function withContext<P1>(getChildContext: (props: P1) => any) {
  return enhance
  function enhance<P2>(BaseComponent: AnyComponent<P2, any>): ComponentConstructor<P1 & P2, any>
  function enhance<P2>(BaseComponent: (props: P2, context?: any) => JSX.Element): ComponentConstructor<P1 & P2, any>
  function enhance<P2>(BaseComponent: AnyComponent<P2, any>): ComponentConstructor<P1 & P2, any>
  function enhance<P2>(BaseComponent: AnyComponent<P2, any>): ComponentConstructor<P1 & P2, any> {
    return class WithContext extends Component<any, any> {
      static displayName = `withContext(${getDisplayName(BaseComponent)})`
      getChildContext = () => getChildContext(this.props)
      render(props: any) {
        return h(BaseComponent as any, props)
      }
    }
  }
}
