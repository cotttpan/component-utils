import { pure } from '../pure';

describe('pure', () => {
    test('result of shuoldComponentUpdate', () => {
        interface Props { v1: string; v2: number; }

        const View = (props: Props) => null;

        const Comp = pure(View);
        const comp = new Comp({ v1: 'hello', v2: 1 });

        expect(comp.shouldComponentUpdate({ v1: 'hello', v2: 1 }, {}, {})).toBe(false);
        expect(comp.shouldComponentUpdate({ v1: 'hello', v2: 0 }, {}, {})).toBe(true);
    });
});
