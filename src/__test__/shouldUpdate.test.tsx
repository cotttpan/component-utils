import { shouldUpdate } from '../shouldUpdate';

describe('shouldUpdate', () => {
    test('result of shuoldComponentUpdate', () => {
        interface Props { value: string; }

        const test = (current: Props, next: Props) => current.value !== next.value;
        const View = (props: Props) => null;

        const Comp = shouldUpdate(test)(View);
        const comp = new Comp({ value: 'string' });

        expect(comp.shouldComponentUpdate({ value: 'string' }, {}, {})).toBe(false);
        expect(comp.shouldComponentUpdate({ value: 'xxx' }, {}, {})).toBe(true);
    });
});
