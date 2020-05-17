import _ from 'lodash'

/**
 * This codemod converts code written with "babel-plugin-jsx-control-statements" 
 * to plain JavaScript.
 */
export default function transformer(file, api) {
  const j = api.jscodeshift
  return j(file.source)
    .find(j.JSXElement)
    .filter((value) => _.get(value, 'value.openingElement.name.name') === 'If')
    .forEach((v) => console.log(v))
    .forEach((path) => {
      const children = _.get(path, 'value.children')
      const attributes = _.get(path, 'value.openingElement.attributes')
      const conditionAttribute = attributes.find(
        (v) => _.get(v, 'name.name') === 'condition',
      )
      const condition = conditionAttribute.value.expression
      const left = j.callExpression(j.identifier('Boolean'), [condition])
      const right = j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('React.Fragment')),
        j.jsxClosingElement(j.jsxIdentifier('React.Fragment')),
        children,
      )
      let expression = j.logicalExpression('&&', left, right)
      const isInsideJsx = _.get(path, 'parentPath.name') === 'children'
      if (isInsideJsx) {
        expression = j.jsxExpressionContainer(expression)
      }
      j(path).replaceWith(expression)
    })
    .toSource()
}

export const parser = 'tsx'
