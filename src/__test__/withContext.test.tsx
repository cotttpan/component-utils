import { withContext } from '../withContext';
import { render, h } from 'preact';

const $root = document.body;
let $el: Element & { _component?: any };

describe('withContext', () => {
    test('type chekc', () => {
        const view = (props: { n: number }) => null;
        const hoc = withContext((props: { x: number }) => ({ ctx: 'ctx' }));
        const Comp = hoc(view);
        const c = <Comp n={1} x={0} />;
    });

    test('passed context on BaseComponent', () => {
        expect.assertions(2);

        const view = (props: {}, context: any) => {
            expect(context).toEqual({ ctx: 'ctx' });
            return null;
        };

        const hoc = withContext((props: { ctx: string }) => ({ ctx: props.ctx }));
        const Comp = hoc(view);

        $el = render(<Comp ctx='ctx' />, $root, $el);
        const comp = $el._component;
        comp.forceUpdate();
    });
});
