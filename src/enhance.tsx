import { AnyComponent, ComponentConstructor } from './common-types';

export function enhance<T>(BaseComponent: AnyComponent<T>) {
    return new Enhancer<T>(BaseComponent);
}

export class Enhancer<T> {
    _component: AnyComponent<any>;

    constructor(BaseComponent: AnyComponent<T>) {
        this._component = BaseComponent;
    }

    wrap<U>(hoc: (BaseComponent: AnyComponent<T>) => AnyComponent<U>) {
        this._component = hoc(this._component);
        return this as any as Enhancer<U>;
    }

    build() {
        return this._component as ComponentConstructor<T, any>;
    }
}
