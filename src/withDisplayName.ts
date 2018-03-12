import { h, AnyComponent, FunctionalComponent } from 'preact'
import { getDisplayName } from './getDisplayName'

export function withDisplayName(name: string) {
  return <P>(comp: AnyComponent<P, any>): FunctionalComponent<P> => {
    const baseName = getDisplayName(comp)
    const wrapper: any = (props: any) => h(comp, props)
    wrapper.displayName = `${name}(${baseName})`
    return wrapper
  }
}
