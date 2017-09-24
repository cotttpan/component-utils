import { Component, h } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent, ComponentEnhancer, EventHandlers, Constant } from './common-types';
import { Hash, noop } from '@cotto/utils.ts';
import { Stream, Subscription } from 'most';
import { async } from 'most-subject';

export namespace withEventStreamHandlers {
    export interface HandlerCreator<P> {
        (props: Constant<P>, context: Constant<any>): (event$: Stream<Event>) => Stream<any>;
    }

    export type HandlerCreators<P = {}> = Hash<HandlerCreator<P>>;

    export interface HandlerCreatorsFactory<InjectedProps, RequiredProps> {
        (props: RequiredProps, context: any): InjectedProps;
    }
}

export type _HCreators<P> = withEventStreamHandlers.HandlerCreators<P>;
export type _HFactory<IP, RP> = withEventStreamHandlers.HandlerCreatorsFactory<IP, RP>;

export function withEventStreamHandlers<RequiredProps, InjectedProps extends _HCreators<RequiredProps>>(
    handlers: (_HCreators<RequiredProps> & InjectedProps) | _HFactory<InjectedProps, RequiredProps>
): ComponentEnhancer<EventHandlers<InjectedProps> & RequiredProps, RequiredProps> {
    return (BaseComponent: AnyComponent) => class WithEventStreamHandlers extends Component<any, any> {
        static displayName = `withEventStreamHandlers(${getDisplayName(BaseComponent)})`;

        handlers: EventHandlers<any> = {};
        _subscriptions: Subscription<any>[] = [];

        constructor(props: any, context: any) {
            super(props, context);

            const getProps = () => this.props;
            const getContext = () => this.context;
            const hlds = typeof handlers === 'function' ? handlers(this.props, this.context) : handlers;

            // tslint:disable:forin
            for (const key in handlers) {
                const subject = async<Event>();
                const observe = hlds[key](getProps, getContext);

                this.handlers[key] = (event: Event) => {
                    return subject.next(event);
                };

                this._subscriptions.push(observe(subject)
                    .subscribe({ next: noop, error: noop, complete: noop })
                );
            }
            // tslint:enable:forin
        }

        componentWillUnmount() {
            this._subscriptions.forEach(sub => sub.unsubscribe());
        }

        render() {
            return h(BaseComponent, { ...this.props, ...this.handlers });
        }
    };
}

