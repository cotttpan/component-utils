import { AnyComponent } from 'preact'
import { shouldUpdate } from './shouldUpdate'
import { not } from '@cotto/utils.ts'
const shallowequal = require('shallowequal')// tslint:disable-line
const notShallowEq = not(shallowequal)

export function pure<P>(BaseComponent: AnyComponent<P, any>) {
  return shouldUpdate<P>(notShallowEq)(BaseComponent)
}
