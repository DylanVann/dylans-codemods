/* eslint-disable curly */
module.exports = (file, api) => {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.Identifier)
    .forEach(path => {
      if (path.node.name !== "assert") return;
      if (path.parentPath.value.type !== "MemberExpression") return;
      const name = path.parentPath.value.property.name;
      const args = path.parentPath.parentPath.value.arguments;
      if (name === "deepEqual" || name === "deepStrictEqual") {
        const expect = j.callExpression(j.identifier("expect"), [args[0]]);
        const toEqual = j.callExpression(j.identifier("toEqual"), [args[1]]);
        const expectToEqual = j.memberExpression(expect, toEqual, false);
        j(path.parentPath.parentPath).replaceWith(expectToEqual);
      }
      if (name === "equal" || name === "strictEqual") {
        const expect = j.callExpression(j.identifier("expect"), [args[0]]);
        const toBe = j.callExpression(j.identifier("toBe"), [args[1]]);
        const expectToBe = j.memberExpression(expect, toBe, false);
        j(path.parentPath.parentPath).replaceWith(expectToBe);
      }
      if (name === "notEqual" || name === "notStrictEqual") {
        const expect = j.callExpression(j.identifier("expect"), [args[0]]);
        const toBe = j.callExpression(j.identifier("not.toBe"), [args[1]]);
        const expectToBe = j.memberExpression(expect, toBe, false);
        j(path.parentPath.parentPath).replaceWith(expectToBe);
      }
      if (name === "throws") {
        const func = args[0];
        const error = args[1];
        const expect = j.callExpression(j.identifier("expect"), [func]);
        const toThrow = j.callExpression(j.identifier("toThrow"), [error]);
        const expectToThrow = j.memberExpression(expect, toThrow, false);
        j(path.parentPath.parentPath).replaceWith(expectToThrow);
      }
      if (name === "ok") {
        const assertion = args[0];
        const expect = j.callExpression(j.identifier("expect"), [assertion]);
        const toThrow = j.callExpression(j.identifier("toBe"), [
          j.booleanLiteral(true)
        ]);
        const expectToThrow = j.memberExpression(expect, toThrow, false);
        j(path.parentPath.parentPath).replaceWith(expectToThrow);
      }
    })
    .toSource();
};
