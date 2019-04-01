import get from 'lodash/get'

function flattenDeep(arr1) {
    return arr1.reduce(
        (acc, val) =>
            Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
        [],
    )
}

export default function transformer(file, api) {
    const j = api.jscodeshift
    const root = j(file.source)

    root.find(j.ArrowFunctionExpression)
        .filter(v => get(v, 'value.typeParameters'))
        .forEach(v => {
            const oldNode = v.value
            const body = oldNode.body

            // Must be a BlockStatement.
            const newBody =
                body.type === 'BlockStatement'
                    ? oldNode.body
                    : j.blockStatement([j.returnStatement(oldNode.body)])

            const isVariable =
                get(v, 'parentPath.value.type') === 'VariableDeclarator'

            if (isVariable) {
                const possibleName = get(v, 'parentPath.value.id')
                const newNode = j.functionDeclaration(
                    possibleName || j.identifier(''),
                    oldNode.params,
                    newBody,
                )
                newNode.typeParameters = oldNode.typeParameters
                newNode.returnType = oldNode.returnType
                newNode.comments = v.parent.parent.value.comments

                j(v.parent.parent).replaceWith(newNode)
            } else {
                // create anonymous
                const newNode = j.functionDeclaration(
                    j.identifier(''),
                    oldNode.params,
                    newBody,
                )

                newNode.typeParameters = oldNode.typeParameters
                newNode.returnType = oldNode.returnType

                j(v).replaceWith(newNode)
            }
        })

    return root.toSource()
}

module.exports.parser = 'flow'
