export interface Component {
    displayName?: string;
    name?: string;
}

export function getDisplayName(component: Component) {
    return component.displayName || component.name || 'Component';
}
