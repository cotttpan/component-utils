import { Component, h, ComponentConstructor } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent } from './common-types';

export namespace withContext {
    export interface Enhancer<RequiredProps> {
        <OwnProps extends RequiredProps>(
            BaseComponent: AnyComponent<OwnProps>
        ): ComponentConstructor<OwnProps, {}>;
    }
}

export function withContext<RequiredProps = {}>(
    contextCreator: (props: RequiredProps) => any
): withContext.Enhancer<RequiredProps> {
    return function enhance(BaseComponent: AnyComponent) {
        return class WithContext extends Component<any, any> {
            static displayName = `withContext(${getDisplayName(BaseComponent)})`;

            getChildContext() {
                return contextCreator(this.props);
            }

            render() {
                return h(BaseComponent, this.props);
            }
        };
    };
}
