import { Component, ComponentConstructor } from 'preact'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { of } from 'rxjs/observable/of'
import { async } from 'rxjs/scheduler/async'
import { map, filter, observeOn } from 'rxjs/operators'
import { EventSource, Command, isCommand, Dispatcher } from 'command-bus'
import { Renderer, renderProps } from './renderProps'
import { store } from './store'

export interface Reducer<T> {
  (state: T): T
}

export type Model<P, S> = (props: P, context: any)
  => (ev: EventSource, props$: Observable<P>) => Observable<Reducer<S>>

export type Epic<P, S> = (props: P, context: any)
  => (ev: EventSource, state$: Observable<S>) => Observable<Command | null>

export type Inject<P, R> = (props: P, context: any) => R

export type View<P, C> = (props: P, context: C) => JSX.Element | null

export interface FluxOptions<P, S, C> {
  name?: string,
  model: Model<P, S>
  epic?: Epic<P, S>
  inject?: Inject<P, C>
  view?: View<S, C>
}

export function flux<P, S, C>({ name, model, epic, inject, view }: FluxOptions<P, S, C>)
  : ComponentConstructor<P & Renderer<S, C>, any> {
  return class FluxContainer extends Component<P & Renderer<S, C>, any> {
    static displayName = `FluxContainer(${name})`

    state = { vdom: null }
    props$ = new BehaviorSubject(this.props)
    subscriptions: Subscription[] = []

    constructor(props: any, context: any) {
      super(props, context)

      if (context.dispatcher == null) {
        throw new Error(`Require "context.dispatcher" as EventSource at${name}`)
      }

      const ev: Dispatcher = context.dispatcher
      const state$ = model(props, context)(ev, this.props$).pipe(store())
      const action$ = epic ? epic(props, context)(ev, state$) : of(null)
      const injection = inject ? inject(props, context) : {} as C

      const render = (state: S) => view
        ? view(state, injection)
        : renderProps(this.props, state, injection)

      const vdom$ = state$.pipe(map(render))
      const reaction$ = action$.pipe(filter(isCommand), observeOn(async))

      this.subscriptions.push(
        vdom$.subscribe(vdom => this.setState({ vdom })),
        reaction$.subscribe(command => ev.dispatch(command)),
      )
    }
    shouldComponentUpdate(_: any, nextState: any) {
      return this.state.vdom !== nextState.vdom
    }
    componentWillReceiveProps(nextProps: P) {
      this.props$.next(nextProps)
    }
    componentWillUnmount() {
      this.props$.complete()
      this.subscriptions.forEach(s => s.unsubscribe())
    }
    render() {
      return this.state.vdom
    }
  }
}
