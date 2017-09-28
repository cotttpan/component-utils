import { h, FunctionalComponent } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent } from './common-types';
import { Hash } from '@cotto/utils.ts';

export namespace mapProps {
    export interface Enhancer<InjectedProps, RequiredProps> {
        (BaseComponent: AnyComponent<InjectedProps>): FunctionalComponent<RequiredProps & Hash>;
    }
}

export function mapProps<InjectedProps, RequiredProps>(
    mapper: (props: RequiredProps, context: any) => InjectedProps
): mapProps.Enhancer<InjectedProps, RequiredProps> {
    return (BaseComponent: AnyComponent) => {
        const c: FunctionalComponent<any> = (props: any, context: any) => h(BaseComponent, mapper(props, context));
        c.displayName = `mapProps(${getDisplayName(BaseComponent)})`;
        return c;
    };
}
