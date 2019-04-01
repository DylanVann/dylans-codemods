const myFuncA = (a, b) => a + b

const myFuncB = <T>(a: T, b: T): T => a + b

// comment
const myFuncC = <T>(a: T, b: T): T => {
    return a + b
}

function myFuncD<T>(a: T, b: T): T {
    return a + b
}

const nested = () => <T>(a: T, b: T): T => a + b
