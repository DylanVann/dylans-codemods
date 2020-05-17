// https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf
const get = (obj, path, def) =>
  (() =>
    typeof path === 'string'
      ? path.replace(/\[(\d+)]/g, '.$1')
      : path.join('.'))()
    .split('.')
    .filter(Boolean)
    .every((step) => (obj = obj[step]) !== undefined)
    ? obj
    : def

/**
 * This codemod converts code written with "babel-plugin-jsx-control-statements"
 * to plain JavaScript.
 */
export default function transformer(file, api) {
  const j = api.jscodeshift
  return j(file.source)
    .find(j.JSXElement)
    .filter((value) => get(value, 'value.openingElement.name.name') === 'If')
    .forEach((path) => {
      const children = get(path, 'value.children')
      const isEmptyText = (child) =>
        typeof child.value === 'string' && child.value.trim() === ''
      const filteredChildren = children.filter((v) => !isEmptyText(v))
      const attributes = get(path, 'value.openingElement.attributes')
      const conditionAttribute = attributes.find(
        (v) => get(v, 'name.name') === 'condition',
      )
      const condition = conditionAttribute.value.expression
      const left = j.callExpression(j.identifier('Boolean'), [condition])
      const right =
        filteredChildren.length === 1
          ? filteredChildren[0]
          : j.jsxElement(
              j.jsxOpeningElement(j.jsxIdentifier('React.Fragment')),
              j.jsxClosingElement(j.jsxIdentifier('React.Fragment')),
              children,
            )
      let expression = j.logicalExpression('&&', left, right)
      const isInsideJsx = get(path, 'parentPath.name') === 'children'
      if (isInsideJsx) {
        expression = j.jsxExpressionContainer(expression)
      }
      j(path).replaceWith(expression)
    })
    .toSource()
}

export const parser = 'tsx'
