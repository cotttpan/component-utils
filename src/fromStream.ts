import { Component, ComponentConstructor } from 'preact'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Renderer, renderProps } from './renderProps'

export type StreamFactory<T, U> = (props: T, context: any)
  => (props$: Observable<T>) => Observable<U>

export function fromStream<T, U>(
  factory: StreamFactory<T, U>,
): ComponentConstructor<T & Renderer<U>, any> {
  return class FromStreamContainer extends Component<T & Renderer<U>, any> {
    state = { vdom: null }
    props$ = new BehaviorSubject(this.props)
    subscription: Subscription

    constructor(props: any, context: any) {
      super(props, context)
      this.subscription = factory(props, context)(this.props$)
        .pipe(map(state => renderProps(this.props, state)))
        .subscribe(vdom => this.setState({ vdom }))
    }
    shouldComponentUpdate(_: any, nextState: any) {
      return this.state.vdom !== nextState.vdom
    }
    componentWillReceiveProps(nextProps: T) {
      this.props$.next(nextProps)
    }
    componentWillUnmount() {
      this.props$.complete()
      this.subscription.unsubscribe()
    }
    render() {
      return this.state.vdom
    }
  }
}
