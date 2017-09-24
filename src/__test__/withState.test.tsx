import { withState } from '../withState';
import { Component, h, render } from 'preact';

const $root = document.body;
let $el: Element & { _component?: any };

describe('withState', () => {
    interface Props {
        count: number;
        patch: withState.Updater<Props>;
    }

    const View = (props: Props) => null;
    const HOC1 = withState((init: { count: number }) => ({ count: init.count }), 'patch');
    const HOC2 = withState({ count: 0 }, 'patch');

    test('type check', () => {
        const C1 = HOC1(View);
        const C2 = HOC2(View);
        const c1 = () => (<C1 count={0} />);
        const c2 = () => (<C2 />);
    });

    test('displayName', () => {
        expect(HOC1(View).displayName).toBe('withState(View)');
    });

    test('update state via object and with completed callback', (done) => {
        expect.assertions(2);

        $el = render(h(HOC2(View), {}), $root, $el);
        const counter = $el._component;

        expect(counter.state).toEqual({ count: 0 });

        counter.patch({ count: 1 }, () => {
            expect(counter.state).toEqual({ count: 1 });
            done();
        });
    });


    test('update state via callback and with complated callback', (done) => {
        expect.assertions(3);

        $el = render(h(HOC1(View), { count: 1 }), $root, $el);
        const counter = $el._component;

        expect(counter.state).toEqual({ count: 1 });

        counter.patch((props: any) => {
            expect(props).toEqual({ count: 1 });
            return ({ count: props.count + 1 });
        }, () => {
            expect(counter.state).toEqual({ count: 2 });
            done();
        });
    });

    test('BaseComponent props', () => {
        expect.assertions(5);

        const mock = jest.fn();
        const view = withState({ count: 0 })(mock);

        $el = render(h(view, {}), $root, $el);
        const counter = $el._component;
        const child = counter._component;

        expect(child.props).toHaveProperty('count', 0);
        expect(child.props).toHaveProperty('setState', counter.patch);

        counter.patch({ count: 1 }, () => {
            expect(counter.state).toEqual({ count: 1 });
            expect(child.props).toHaveProperty('count', 1);
            expect(child.props).toHaveProperty('setState', counter.patch);
        });
    });
});

