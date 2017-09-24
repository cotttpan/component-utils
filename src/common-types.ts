import { ComponentProps, Component } from 'preact';
import { Diff } from '@cotto/utils.ts';

export type ClassComponent<P, S> = ComponentConstructor<P, S> & { displayName?: string };

export type AnyComponent<P = {}> = ClassComponent<P, any> | FunctionalComponent<P>;

export interface ComponentEnhancer<InjectedProps, RequiredProps> {
    <OwnProps /* extends InjectedProps */>(
        BaseComponent: AnyComponent<OwnProps & InjectedProps>
    ): ClassComponent<Diff<OwnProps, InjectedProps> & RequiredProps, any>;
}

export interface FunctionalComponent<PropsType> {
    (props: PropsType & ComponentProps<this>, context?: any): JSX.Element;
    displayName?: string;
    defaultProps?: any;
}

export interface ComponentConstructor<PropsType, StateType> {
    new(props: PropsType, context?: any): Component<PropsType, StateType>;
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
