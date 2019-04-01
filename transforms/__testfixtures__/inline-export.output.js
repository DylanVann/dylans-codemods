/**
 * @public
 */
export type MyType = any;

// comments
export type MyOtherType = any;

export type Complex = {
    // thing.
    thing: number,
};

export type AlreadyExported = any

// Comment above named.
export const NamedExport = 'thing';

// Should not delete this.
export { render } from './render'

function thing() {
    const functionA = function(a, b) {
        return a + b
    }
}

export const functionA = function(a, b) {
    return a + b
};

export const MyComp = () => <div />;