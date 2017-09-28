import { Hash } from '@cotto/utils.ts';

export function getDisplayName(component: Hash) {
    return component.displayName || component.name || 'Component';
}
