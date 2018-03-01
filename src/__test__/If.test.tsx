import { h, render } from 'preact'
import { If } from '../If'

test('If', () => {
  const Base = () => (
    <div>
      <If
        cond={true}
        render={() => <div id='a'>a</div>}
      />

      <If cond={false}>
        {() => <div id='b'>a</div>}
      </If>
    </div>
  )

  render(<Base />, document.body)

  const $a = document.getElementById('a')
  const $b = document.getElementById('b')
  expect($a).toBeTruthy()
  expect($b).toBeFalsy()
})
