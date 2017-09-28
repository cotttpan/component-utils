import { ComponentConstructor, FunctionalComponent } from 'preact';
import { Diff, Overwrite } from '@cotto/utils.ts';

export type AnyComponent<P = {}> = ComponentConstructor<P, any> | FunctionalComponent<P>;

// duplecatedしたい...
export interface ComponentEnhancer<InjectedProps, RequiredProps> {
    <OwnProps /* extends InjectedProps */>(
        BaseComponent: AnyComponent<OwnProps & InjectedProps>
    ): ComponentConstructor<Overwrite<Diff<OwnProps, InjectedProps>, RequiredProps>, any>;
}

export interface EventHandler {
    (event: Event): void;
}

export type EventHandlers<T> = {
    [P in keyof T]: EventHandler
};

export interface Constant<T> {
    (): T;
}
