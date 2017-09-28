import { Component, h, ComponentConstructor } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent } from './common-types';
import { Diff } from '@cotto/utils.ts';

export namespace withState {
    export interface Updater<T> {
        // tslint:disable:unified-signatures
        <K extends keyof T>(nextState: Pick<T, K>, callback?: Function): void;
        <K extends keyof T>(fn: (value: T) => Pick<T, K>, callback?: Function): void;
        // tslint:enable:unified-signatures
    }

    export interface Enhancer<InjectedProps, RequiredProps> {
        <OwnProps extends InjectedProps>(
            BaseComponent: AnyComponent<OwnProps>
        ): ComponentConstructor<Diff<OwnProps, InjectedProps> & RequiredProps, any>;
    }
}

export function withState<InjectedProps, RequiredProps = {}, K extends string = 'setState'>(
    initState: InjectedProps | ((props: RequiredProps) => InjectedProps),
    updateName: K = 'setState' as K
): withState.Enhancer<InjectedProps & {[P in K]: withState.Updater<InjectedProps>}, RequiredProps> {

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
