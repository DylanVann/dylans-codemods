#!/usr/bin/env node

const { mapValues } = require('lodash')

const isNumber = c => '0123456789'.includes(c)

const addCaret = v => {
    if (!isNumber(v[0])) {
        // Don't know how to deal with this.
        return v
    }
    return `^${v}`
}

const addCaretToDeps = (pkg, name) => {
    if (pkg[name]) {
        pkg[name] = mapValues(pkg[name], addCaret)
    }
    return pkg
}

const addCarets = pkg => {
    const ret = { ...pkg }
    addCaretToDeps(ret, 'dependencies')
    addCaretToDeps(ret, 'devDependencies')
    addCaretToDeps(ret, 'peerDependencies')
    return ret
}

if (require.main === module) {
    const fs = require('fs-extra')

    const filesToProcess = process.argv[2]
        ? process.argv.slice(2)
        : [`${process.cwd()}/package.json`]

    filesToProcess.forEach(filePath => {
        const packageJson = fs.readJSONSync(filePath)
        const packageJsonWithCarets = addCarets(packageJson)
        fs.writeJSONSync(filePath, packageJsonWithCarets, { spaces: 2 })
        console.log(`${filePath} is careted!`)
    })
}
