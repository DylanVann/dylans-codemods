/**
 * @public
 */
type MyType = any

// comments
type MyOtherType = any

type Complex = {
    // thing.
    thing: number,
}

export type AlreadyExported = any

// Comment above named.
const NamedExport = 'thing'

export { NamedExport }

// Should not delete this.
export { render } from './render'

export type { MyType, MyOtherType, Complex }

function thing() {
    const functionA = function(a, b) {
        return a + b
    }
}

const functionA = function(a, b) {
    return a + b
}

export { functionA }

const MyComp = () => <div />

export { MyComp as NonsenseName }

import { AThing } from './AThing'

// Should keep this.
export { AThing }
