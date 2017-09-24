import { Component, h } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent, ComponentEnhancer } from './common-types';

export function withContext<RequiredProps = {}>(
    contextCreator: (props: RequiredProps) => any
): ComponentEnhancer<{}, RequiredProps> {
    return function enhance(BaseComponent: AnyComponent) {
        return class WithContext extends Component<any, any> {
            static displayName = `withContext(${getDisplayName(BaseComponent)})`;

            getChildContext() {
                return contextCreator(this.props);
            }

            render() {
                return h(BaseComponent, {});
            }
        };
    };
}
