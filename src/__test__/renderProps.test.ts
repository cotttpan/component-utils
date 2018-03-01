import { renderProps } from '../renderProps'

test('renderProps by render prop', () => {
  const fn = jest.fn()
  renderProps({ render: fn }, { a: 1 })
  expect(fn).toBeCalledWith({ a: 1 }, undefined)
})

test('renderProps by children', () => {
  const fn = jest.fn()
  renderProps({ children: [fn] }, { a: 1 })
  expect(fn).toBeCalledWith({ a: 1 }, undefined)
})

test('with context', () => {
  const fn = jest.fn()
  renderProps({ render: fn }, { a: 1 }, { ctx: true })
  expect(fn).toBeCalledWith({ a: 1 }, { ctx: true })
})

test('when renderer is not a function', () => {
  expect(() => renderProps({}, { a: 1 })).toThrow()
})
