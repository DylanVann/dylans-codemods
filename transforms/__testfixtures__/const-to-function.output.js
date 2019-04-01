const myFuncA = (a, b) => a + b

function myFuncB<T>(a: T, b: T): T {
    return a + b;
}

// comment
function myFuncC<T>(a: T, b: T): T {
    return a + b
}

function myFuncD<T>(a: T, b: T): T {
    return a + b
}

const nested = () => function <T>(a: T, b: T): T {
    return a + b;
}