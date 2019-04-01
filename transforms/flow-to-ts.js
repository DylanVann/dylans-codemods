const { compile } = require('flow-to-typescript')

export default function transformer(file, api) {
    const j = api.jscodeshift
    const root = j(file.source)
    const contents = root.toSource()
    return compile(contents, file.path)
}

module.exports.parser = 'flow'
