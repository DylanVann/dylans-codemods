import assert from 'assert';

assert.deepEqual({a: 'A'}, {b: 'B'});
assert.equal('a', 'b')
assert.notEqual('a', 'b')
assert.strictEqual('a', 'b')
assert.throws('a', Error)