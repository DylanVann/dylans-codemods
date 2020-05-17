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

const getName = (path) => get(path, 'value.openingElement.name.name')

const isEmptyTextChild = (child) =>
  typeof child.value === 'string' && child.value.trim() === ''

const isNotEmptyTextChild = (child) => !isEmptyTextChild(child)

const getSingleJSXNodeFromChildren = (j, children) => {
  const filtered = children.filter(isNotEmptyTextChild)
  if (filtered.length === 1 && filtered[0].type === 'JSXElement') {
    return filtered[0]
  }
  return j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier('React.Fragment')),
    j.jsxClosingElement(j.jsxIdentifier('React.Fragment')),
    children,
  )
}

const getConditionExpression = (openingElement) => {
  const attributes = get(openingElement, 'attributes')
  const conditionAttribute = (attributes || []).find(
    (v) => get(v, 'name.name') === 'condition',
  )
  return get(conditionAttribute, 'value.expression')
}

/**
 * This codemod converts code written with "babel-plugin-jsx-control-statements"
 * to plain JavaScript.
 *
 * e.g. <If condition={thing && otherThing}>output</If> -> Boolean(thing && otherThing) && <React.Fragment>output</React.Fragment>
 *
 * This uses Boolean(conditionals) in the output, the reason for this is that
 * we want to avoid accidentally having falsy values like 0 end up in the
 * output HTMLoutput.
 *
 * This currently converts:
 * - <If condition={cond}>
 * - <Choose> / <When> / <Otherwise>
 *
 * Currently does not convert:
 * - Deprecated </Else>
 * - <For>
 * - <With>
 *
 * For more info see the tests.
 */
export default function transformer(file, api) {
  const j = api.jscodeshift
  return j(file.source)
    .find(j.JSXElement)
    .filter((path) => {
      const name = getName(path)
      return name === 'If' || name === 'Choose'
    })
    .forEach((path) => {
      const name = getName(path)
      if (name === 'Choose') {
        const children = get(path, 'value.children').filter(isNotEmptyTextChild)
        const lastChild = children[children.length - 1]
        const hasOtherwise =
          get(lastChild, 'openingElement.name.name') === 'Otherwise'
        let ret = hasOtherwise
          ? getSingleJSXNodeFromChildren(j, lastChild.children)
          : j.identifier('null')
        const revChildren = [...children]
        revChildren.reverse()
        revChildren.forEach((child) => {
          if (get(child, 'openingElement.name.name') !== 'When') {
            return
          }
          const conditional = getConditionExpression(child.openingElement)
          ret = j.conditionalExpression(
            conditional,
            getSingleJSXNodeFromChildren(j, child.children),
            ret,
          )
        })
        j(path).replaceWith(ret)
        return
      }
      const children = get(path, 'value.children')
      const condition = getConditionExpression(path.value.openingElement)
      const left = j.callExpression(j.identifier('Boolean'), [condition])
      const right = getSingleJSXNodeFromChildren(j, children)
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
