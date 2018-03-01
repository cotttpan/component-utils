import { shouldUpdate } from './shouldUpdate'
import { not } from '@cotto/utils.ts'
import { AnyComponent } from './common-types'

const notShallowEq = not(require('shallowequal'))

export function pure<P>(BaseComponent: AnyComponent<P>) {
  return shouldUpdate<P>(notShallowEq)(BaseComponent)
}
