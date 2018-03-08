import { Component, ComponentConstructor } from 'preact'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { map } from 'rxjs/operators'
import { EventSource, Dispatcher } from 'command-bus'
import { Renderer, renderProps } from './renderProps'

export type StoreFactory<P, S> = (props: P, context: any)
  => (ev: EventSource, props$: Observable<P>) => Observable<S>

export function fromEventSourceContainer<P, S>(name: string, store: StoreFactory<P, S>)
  : ComponentConstructor<P & Renderer<S>, any> {
  return class EventSourceContainer extends Component<P & Renderer<S>, any> {
    static displayName = `EventSourceContainer(${name})`

    state = { vdom: null }
    props$ = new BehaviorSubject(this.props)
    subscription: Subscription

    constructor(props: any, context: any) {
      super(props, context)

      if (context.dispatcher == null) {
        throw new Error(`Require "context.dispatcher" as EventSource at ${name}`)
      }

      const ev: Dispatcher = context.dispatcher
      const state$ = store(props, context)(ev, this.props$)
      const vdom$ = state$.pipe(map(state => renderProps(this.props, state)))
      this.subscription = vdom$.subscribe(vdom => this.setState({ vdom }))
    }
    shouldComponentUpdate(_: any, nextState: any) {
      return this.state.vdom !== nextState.vdom
    }
    componentWillReceiveProps(nextProps: P) {
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
