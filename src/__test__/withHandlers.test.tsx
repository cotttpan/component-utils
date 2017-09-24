import { withHandlers } from '../withHandlers';
import { EventHandler } from '../common-types';
import { h, Component, render } from 'preact';
import { noop } from '@cotto/utils.ts';

const $root = document.body;
let $target: Element & { _component?: any };

interface Props {
    n: number;
    f1: EventHandler;
    f2: EventHandler;
}

describe('withHandlers', () => {
    test('type check', () => {
        const View = (props: Props) => null;

        const HOCWithHCreators = withHandlers({
            f1: (props: { n: number }) => {/*  */ },
            f2: () => (ev: Event) => {/*  */ },
            xxx: () => undefined
        });

        const HOCWithHFactory = withHandlers((p: { n: number }, context: any) => ({
            f1: (props: { n: number }) => {/*  */ },
            f2: () => (ev: Event) => {/*  */ }
        }));

        const C1 = HOCWithHCreators(View);
        const C2 = HOCWithHFactory(View);
        const c1 = () => <C1 n={0} />;
        const c2 = () => <C2 n={0} />;
    });


    test('event emiting', () => {
        expect.assertions(2);

        const fakeHandlerA = jest.fn();
        const fakeHandlerB = jest.fn();

        let $btnA: Element;
        let $btnB: Element;

        const Comp = withHandlers({
            f1: (props: { n: number }) => expect(props).toEqual({ n: 1 }),
            f2: () => (ev: Event) => expect(ev).toBeInstanceOf(Event)
        })((props: Props) => (
            <div>
                <button ref={(el => $btnA = el)} onClick={props.f1}>buttonA</button>
                <button ref={(el => $btnB = el)} onClick={props.f2}>buttonB</button>
            </div>
        ));

        $target = render(h(Comp, { n: 1 }), $root, $target);
        ($btnA as HTMLButtonElement).click();
        ($btnB as HTMLButtonElement).click();
    });


    test('BaseComponentProps', () => {
        class View extends Component<any, any> {
            componentWillReceiveProps(nextProps: any) {
                expect(this.props.f1).toBe(nextProps.f1);
                expect(this.props.f2).toBe(nextProps.f2);
            }

            render() { return null; }
        }

        const Comp = withHandlers({ f1: noop, f2: noop })(View);
        $target = render(h(Comp, {}), $root, $target);
        $target._component.forceUpdate();
        $target._component.forceUpdate();
    });
});

