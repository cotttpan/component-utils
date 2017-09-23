import { getDisplayName } from '../getDisplayName';
import { Component } from 'preact';

test('get displayName from component', () => {
    const A = () => {/*  */ };
    class B extends Component<any, any> {
        render() {
            return null;
        }
    }

    expect(getDisplayName(A as any)).toBe('A');
    expect(getDisplayName(B as any)).toBe('B');
    expect(getDisplayName((() => {/*  */ }) as any)).toBe('Component');
});
