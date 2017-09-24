import { withEventStreamHandlers } from '../withEventStreamHandlers';
import { EventHandler, Constant } from '../common-types';
import { Stream } from 'most';
import { render, h } from 'preact';

const $root = document.body;
let $el: Element & { _component?: any };

describe('withEventStreamHandlers', () => {
    test('event emitting', () => {
        expect.assertions(1);

        interface Props {
            msg: string;
            f1: EventHandler;
        }

        const f1 = (props: Constant<{ msg: string }>) => (event$: Stream<Event>) => {
            return event$.tap(() => {
                expect(props()).toEqual({ mes: 'hello' });
            });
        };

        let ref: Element;
        const HOC = withEventStreamHandlers({ f1 });
        const Comp = HOC((props: Props) => (
            <div>
                <button onClick={props.f1} ref={el => ref = el} >{props.msg}</button>
            </div>
        ))

        render(<Comp msg='hello'></Comp>, $root, $el);
        (ref as HTMLButtonElement).click();
    });
});

