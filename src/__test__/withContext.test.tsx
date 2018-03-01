import { render, h } from 'preact'
import { withContext } from '../withContext'

test('withContext', () => {
  const hoc = withContext(() => ({ ctx: 'ctx' }))
  const view = (_: any, ctx) => h('div', { id: 'test' }, ctx.ctx)
  const Comp = hoc(view)
  render(h(Comp, {}), document.body)
  expect(document.getElementById('test')!.textContent).toBe('ctx')
})
