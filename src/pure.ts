import { AnyComponent } from 'preact'
import { shouldUpdate } from './shouldUpdate'
import shallowequal from 'shallowequal'
import { not } from '@cotto/utils.ts'

const notShallowEq = not(shallowequal) // tslint:disable-line

export function pure<P>(BaseComponent: AnyComponent<P, any>) {
  return shouldUpdate<P>(notShallowEq)(BaseComponent)
}
