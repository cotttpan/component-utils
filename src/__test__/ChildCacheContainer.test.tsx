import { ChildCacheContainer } from '../ChildCacheContainer';
import { h, render } from 'preact';

const $root = document.body;
let $el: Element & { _component?: any };

describe('ChildCacheContainer', () => {
    test('cache', () => {
        const View = () => (
            <ChildCacheContainer key='ckey'>
                {() => null}
            </ChildCacheContainer>
        );

        $el = render(<View />, $root, $el);
        const comp = $el._component;

        function getCachedChild() {
            const child = comp._component;
            const cache = child[ChildCacheContainer.symbol];
            return cache['ckey'];
        }

        const c1 = getCachedChild();
        comp.forceUpdate();
        const c2 = getCachedChild();

        expect(c1).toBe(c2);
    });
});
