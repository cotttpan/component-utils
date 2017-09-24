import { h, Component } from 'preact';
import { getDisplayName } from './getDisplayName';
import { AnyComponent, ComponentEnhancer } from './common-types';

export function mapProps<InjectedProps, RequiredProps>(
    mapper: (props: RequiredProps, context: any) => InjectedProps
): ComponentEnhancer<InjectedProps, RequiredProps> {
    return (BaseComponent: AnyComponent) => class MapProps extends Component<any, any> {
        static displayName = `mapProps(${getDisplayName(BaseComponent)})`;

        render() {
            return h(BaseComponent, mapper(this.props, this.context));
        }
    };
}
