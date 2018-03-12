import { withDisplayName } from '../withDisplayName'

test('withDisplayName', () => {
  const comp = () => null
  const enhanced = withDisplayName('test')(comp)
  expect(enhanced.displayName).toBe('test(comp)')
})
