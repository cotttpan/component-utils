import { Component, h } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent, ComponentEnhancer, EventHandler, EventHandlers } from './common-types';
import { Hash, mapValues } from '@cotto/utils.ts';

export namespace withHandlers {
    export interface HandlerCreator<P> {
        (props: P, context: any): EventHandler | void;
    }

    export type HandlerCreators<P = {}> = Hash<HandlerCreator<P>>;

    export interface HandlerCreatorsFactory<InjectedProps, RequiredProps> {
        (initialProps: RequiredProps, context: any): InjectedProps;
    }
}

export type _HCreators<P> = withHandlers.HandlerCreators<P>;
export type _HFactory<IP, RP> = withHandlers.HandlerCreatorsFactory<IP, RP>;


export function withHandlers<RequiredProps, InjectedProps extends _HCreators<RequiredProps>>(
    handlers: (_HCreators<RequiredProps> & InjectedProps) | _HFactory<InjectedProps, RequiredProps>
): ComponentEnhancer<EventHandlers<InjectedProps> & RequiredProps, RequiredProps> {

    return (BaseComponent: AnyComponent) => class WithHandlers extends Component<any, any> {
        static displayName = `withHandlers(${getDisplayName(BaseComponent)})`;

        handlers: EventHandlers<Function> = mapValues(
            typeof handlers === 'function' ? handlers(this.props, this.context) : handlers,
            func => (ev: Event) => {
                const then = func(this.props, this.context);
                return typeof then === 'function' && then(ev);
            }
        );

        render() {
            return h(BaseComponent, { ...this.props, ...this.handlers });
        }
    };
}
