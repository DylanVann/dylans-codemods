import get from 'lodash/get'

function flattenDeep(arr1) {
    return arr1.reduce(
        (acc, val) =>
            Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
        [],
    )
}

function isRelevant({ value }) {
    return (
        value.declaration === null &&
        value.source === null &&
        value.specifiers.length > 0
    )
}

export default function transformer(file, api) {
    const j = api.jscodeshift
    const root = j(file.source)

    const exportedThings = root
        .find(j.ExportNamedDeclaration)
        .filter(isRelevant)
        .forEach(path => {
            const specifiers = path.node.specifiers
            const newSpecifiers = []
            specifiers.forEach(s => {
                const localName = s.local.name
                let replaced = false
                root.find(j.TypeAlias)
                    .filter(v => v.value.id.name === localName)
                    .forEach(v => {
                        const name = v.value.id.name
                        const node = v.value
                        const newNode = j.exportNamedDeclaration(node)
                        newNode.comments = node.comments
                        node.comments = null
                        j(v).replaceWith(newNode)
                        replaced = true
                    })
                if (!replaced) {
                    newSpecifiers.push(s)
                }
            })
            if (newSpecifiers.length === 0) {
                j(path).remove()
            } else {
                path.node.specifiers = newSpecifiers
            }
        })

    return root.toSource()
}

module.exports.parser = 'flow'
