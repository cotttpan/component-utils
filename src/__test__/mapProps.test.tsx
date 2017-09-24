import { mapProps } from '../mapProps';
import { render, h } from 'preact';

const $root = document.body;
let $target: Element & { _component?: any };

describe('mapProps', () => {
    it('pass props to BaseComponent from mapper function', () => {
        const mapper = (props: { message: string }) => ({ count: props.message.length });
        const View = (props: { count: number }) => {
            expect(props.count).toBe(5);
            return null;
        };

        const Comp = mapProps(mapper)(View);
        $target = render(<Comp message='hello'></Comp>, $root, $target);
        const comp = $target._component;
        comp.forceUpdate();
        comp.forceUpdate();
    });
});
