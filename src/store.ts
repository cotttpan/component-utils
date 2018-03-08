import { Observable } from 'rxjs/Observable'
import { scan, distinctUntilChanged, shareReplay } from 'rxjs/operators'

const shallowequal = require('shallowequal') // tslint:disable-line

export interface Reducer<T> {
  (state: T): T
}

export const store = <S>(init?: S) => (reducer$: Observable<Reducer<S>>): Observable<S> => {
  return reducer$.pipe(
    scan((state: S, reducer: Reducer<S>) => reducer(state), init || {} as S),
    distinctUntilChanged(shallowequal),
    shareReplay(1),
  )
}

