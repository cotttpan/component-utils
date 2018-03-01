export interface Children<P, C = any> extends Array<any> {
  [0]: (props: P, context: C) => JSX.Element
}

export interface Renderer<P, C = any> {
  render?: (props: P, context: C) => JSX.Element
  children?: Children<P, C>
}

function getRenderer<P, C>({ render, children }: Renderer<P, C>) {
  return render || (children
    ? typeof children === 'function'
      ? children
      : children![0]
    : null)
}

export function renderProps<P, C>(src: Renderer<P, C>, props: P, context?: C) {
  const renderer = getRenderer(src)

  if (process.env.NODE_ENV !== 'production') {
    if (typeof renderer !== 'function') {
      throw new Error(`[renderProps]: Renderer is not a function`)
    }
  }

  return renderer ? renderer(props, context!) : null
}
