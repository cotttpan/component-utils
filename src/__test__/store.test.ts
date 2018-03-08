import { store } from '../store'
import { of } from 'rxjs/observable/of'
import { concatMap, delay, toArray } from 'rxjs/operators'

test('store', async () => {
  type S = { count: number } // tslint:disable-line
  const reducer = (s: S): S => ({ ...s, count: s.count + 1 })
  const state$ = of(reducer, reducer, reducer).pipe(
    concatMap(fn => of(fn).pipe(delay(1))),
    store({ count: 0 }),
    toArray(),
  )
  const results = await state$.toPromise()
  expect(results).toEqual([{ count: 1 }, { count: 2 }, { count: 3 }])
})
