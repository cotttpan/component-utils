import { flux } from '../flux'
import { create, EventSource, select, Dispatcher } from 'command-bus'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { merge } from 'rxjs/observable/merge'
import { delay, concatMap, toArray, map, share, withLatestFrom } from 'rxjs/operators'
import { h, render, Component } from 'preact'
import { delay as defer } from '@cotto/utils.ts'

const INCREMENT = create<number>('INCREMENT')
const DECREMENT = create<number>('DECREMENT')
const RE_INCREMENT = create<number>('RE_INCREMENT')

type P = { name: string }
type S = { name: string, count: number }

const model = (initialProps: P) => (ev: EventSource, props$: Observable<P>) => {
  expect(initialProps.name).toBe('counter')

  const init$ = of((_: S): S => ({ name: '', count: 0 }))
  const name$ = props$.pipe(
    map(props => (state: S): S => {
      return { ...state, name: props.name }
    }),
  )
  const increment$ = select(ev, [INCREMENT, RE_INCREMENT]).pipe(
    map(action => (state: S): S => {
      return { ...state, count: state.count + action.payload }
    }),
  )
  const decrement$ = select(ev, DECREMENT).pipe(
    map(action => (state: S): S => {
      return { ...state, count: state.count - action.payload }
    }),
  )
  return merge(init$, name$, increment$, decrement$).pipe(share())
}

const epic = () => (ev: EventSource, state$: Observable<S>) => {
  return select(ev, INCREMENT).pipe(
    map(() => RE_INCREMENT(1)),
  )
}

const inject = (_: P, context: any) => ({
  INCREMENT: () => context.dispatch(INCREMENT(1)),
  DECREMENT: () => context.dispatch(DECREMENT(1)),
})


test('flux', async () => {
  expect.assertions(5)
  const dispatcher = new Dispatcher()
  const Container = flux({ name: 'Counter', model, epic, inject })
  class App extends Component<any, any> {
    getChildContext = () => ({ dispatcher, dispatch: dispatcher.dispatch.bind(dispatcher) })
    render() {
      return (
        <Container
          name='counter'
          render={(props, action) => (
            <div>
              <div id='name'>{props.name}</div>
              <div id='count'>{props.count}</div>
              <button id='increment' onClick={action.INCREMENT} >increment</button>
              <button id='decrement' onClick={action.DECREMENT}>decrement</button>
            </div>
          )}
        />
      )
    }
  }

  render(<App />, document.body)

  const $name = document.getElementById('name')!
  const $count = document.getElementById('count')!
  const $increment = document.getElementById('increment')
  const $decrement = document.getElementById('decrement')

  /* initial view */
  expect($name.textContent).toBe('counter')
  expect($count.textContent).toBe('0')

  /* update view */
  $increment.click()
  await defer(1)
  expect($count.textContent).toBe('2')

  $decrement.click()
  await defer(1)
  expect($count.textContent).toBe('1')
})
