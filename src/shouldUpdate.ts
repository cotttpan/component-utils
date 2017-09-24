import { Component, h } from 'preact';
import { AnyComponent, ComponentEnhancer } from './common-types';
import { getDisplayName } from './getDisplayName';

export function shouldUpdate<RequiredProps>(
    test: (props: RequiredProps, nextProps: RequiredProps) => boolean
): ComponentEnhancer<RequiredProps, RequiredProps> {
    return function enhance(BaseComponent: AnyComponent) {
        return class ShouldUpdate extends Component<any, any> {
            static displayName = `shouldUpdate(${getDisplayName(BaseComponent)})`;

            shouldComponentUpdate(nextProps: any) {
                return test(this.props, nextProps);
            }

            render() {
                return h(BaseComponent, { ...this.props });
            }
        };
    };
}
