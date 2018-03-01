import { renderProps, Renderer } from './renderProps'

export interface Props {
  cond: boolean
}

export function If(props: Props & Renderer<Props>) {
  return Boolean(props.cond) ? renderProps(props, props) : null
}
