const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'assert-to-jest')
defineTest(__dirname, 'inline-export')
defineTest(__dirname, 'const-to-function')
defineTest(__dirname, 'flow-to-ts')
