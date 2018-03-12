import { fromStream } from '../fromStream'
import { store } from '../store'
import { create, select, Dispatcher } from 'command-bus'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { merge } from 'rxjs/observable/merge'
import { map } from 'rxjs/operators'
import { h, render, Component } from 'preact'
import { delay as defer } from '@cotto/utils.ts'

const INCREMENT = create<number>('INCREMENT')
const DECREMENT = create<number>('DECREMENT')
const RE_INCREMENT = create<number>('RE_INCREMENT')

type P = { name: string }
type S = { name: string, count: number }

const factory = (initialProps: P, context: any) => (props$: Observable<P>) => {
  expect(initialProps.name).toBe('counter')
  const ev = context.dispatcher

  const init$ = of((_: S): S => ({ name: '', count: 0 }))
  const name$ = props$.pipe(
    map(props => (state: S): S => ({ ...state, name: props.name })),
  )
  const increment$ = select(ev, INCREMENT).pipe(
    map(action => (state: S): S => ({ ...state, count: state.count + action.payload })),
  )
  const decrement$ = select(ev, DECREMENT).pipe(
    map(action => (state: S): S => ({ ...state, count: state.count - action.payload })),
  )
  return merge(init$, name$, increment$, decrement$).pipe(store())
}

test('fromStream', async () => {
  expect.assertions(5)

  const dispatcher = new Dispatcher()
  const Container = fromStream(factory)

  class App extends Component<any, any> {
    getChildContext = () => ({ dispatcher })
    increment = () => dispatcher.dispatch(INCREMENT(1))
    decrement = () => dispatcher.dispatch(DECREMENT(1))
    render() {
      return (
        <Container name='counter'>
          {(props: S) => (
            <div>
              <div>
                <div id='name'>{props.name}</div>
                <div id='count'>{props.count}</div>
                <button id='increment' onClick={this.increment} >increment</button>
                <button id='decrement' onClick={this.decrement}>decrement</button>
              </div>
            </div>
          )}
        </Container>
      )
    }
  }

  render(<App />, document.body)

  const $name = document.getElementById('name')
  const $count = document.getElementById('count')
  const $increment = document.getElementById('increment')
  const $decrement = document.getElementById('decrement')

  /* initial view */
  expect($name.textContent).toBe('counter')
  expect($count.textContent).toBe('0')

  /* update view */
  $increment.click()
  await defer(1)
  expect($count.textContent).toBe('1')

  $decrement.click()
  await defer(1)
  expect($count.textContent).toBe('0')
})
