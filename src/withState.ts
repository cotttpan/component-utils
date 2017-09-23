import { Component, h } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent, ComponentEnhancer } from './common-types';

export namespace withState {
    export interface Updater<T> {
        // tslint:disable:unified-signatures
        <K extends keyof T>(nextState: Pick<T, K>, callback?: Function): void;
        <K extends keyof T>(fn: (value: T) => Pick<T, K>, callback?: Function): void;
        // tslint:enable:unified-signatures
    }
}

export function withState<InjectedProps, RequiredProps = {}, K extends string = 'setState'>(
    initState: InjectedProps | ((props: RequiredProps) => InjectedProps),
    updateName: K = 'setState' as K
): ComponentEnhancer<InjectedProps & {[P in K]: withState.Updater<InjectedProps>}, RequiredProps> {

    return function enhance(BaseComponent: AnyComponent<any>) {

        return class WithState extends Component<any, any> {
            static displayName = `withState(${getDisplayName(BaseComponent)})`;

            state = typeof initState === 'function'
                ? initState(this.props)
                : initState;

            patch: withState.Updater<any> = (nextPatch: any, callback?: () => void) => {
                const update = (state: any) => typeof nextPatch === 'function'
                    ? nextPatch(state)
                    : nextPatch;

                return this.setState(update, callback);
            }

            render(props: any, state: any) {
                return h(BaseComponent, {
                    ...props,
                    ...state,
                    [updateName]: this.patch
                });
            }
        };
    };
}
