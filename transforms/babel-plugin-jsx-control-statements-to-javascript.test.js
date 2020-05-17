import { defineSnapshotTest } from 'jscodeshift/dist/testUtils'
import transform from './babel-plugin-jsx-control-statements-to-javascript'

const transformOptions = {}

defineSnapshotTest(
  transform,
  transformOptions,
  `
function MyComp() {
  return (
    <If condition={true}>
      one
      {'two'}
      <span>three</span>
      <span>four</span>
    </If>
  )
}
`,
  'outermost element of return statement',
)

defineSnapshotTest(
  transform,
  transformOptions,
  `
function MyComp() {
  return (
    <span>
      <If condition={true}>
        one
        {'two'}
        <span>three</span>
        <span>four</span>
      </If>
    </span>
  )
}
`,
  'inside jsx',
)

defineSnapshotTest(
  transform,
  transformOptions,
  `
function MyComp() {
  return (
    <span>
      <If condition={true}>
        <span>four</span>
      </If>
    </span>
  )
}
`,
  'single child',
)

defineSnapshotTest(
  transform,
  transformOptions,
  `
function MyComp() {
  return <If condition={thing && otherThing}>text</If>
}
`,
  'just text children',
)

defineSnapshotTest(
  transform,
  transformOptions,
  `
function MyComp() {
  return (
    <Choose>
      <When condition={test1}>
        <span>IfBlock1</span>
      </When>
      <When condition={test2}>
        <span>IfBlock2</span>
      </When>
      <Otherwise>
        <span>ElseBlock</span>
      </Otherwise>
    </Choose>
  )
}
`,
  'choose',
)
