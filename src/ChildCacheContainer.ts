import { Hash } from '@cotto/utils.ts';
import { h, Component } from 'preact';

export const CACHE_SYMBOL = Symbol('@@ChildCacheContainer');

export function cache<T extends Function>(container: Hash, fn: T, key?: string | symbol): T {
    key = key || fn.name;
    const _cache = container[CACHE_SYMBOL] || (container[CACHE_SYMBOL] = {});
    return _cache[key] || (_cache[key] = fn);
}

export class ChildCacheContainer extends Component<{ key?: string }, {}> {
    static symbol = CACHE_SYMBOL;

    ckey = this.props.key || Symbol('ckey');
    render(props: any) {
        const child = props.children[0];
        return h(cache(this, child, this.ckey), {});
    }
}
