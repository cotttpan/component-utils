export function getDisplayName(component: any): string {
  return component == null ? '' :  component.displayName || component.name || 'Component'
}
