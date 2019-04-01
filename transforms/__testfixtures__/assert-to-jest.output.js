import assert from 'assert';

expect({a: 'A'}).toEqual({b: 'B'});
expect('a').toBe('b')
expect('a').not.toBe('b')
expect('a').toBe('b')
expect('a').toThrow(Error)