const isDefault = s => s.type === 'ImportDefaultSpecifier';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const collection = j(file.source);
  return (
    collection
      .find(j.ImportDeclaration)
      // imports from the decorators file
      .filter(p => p.value.source.value.endsWith('decorators'))
      // has a default import
      .filter(p => p.value.specifiers.some(isDefault))
      .forEach(path => {
        // get default import name
        const importName = path.value.specifiers.find(isDefault).local.name;
        const usedMethods = [];
        // get methods used in this file
        collection
          .find(j.MemberExpression)
          .filter(v => v.value.object.name === importName)
          .forEach(v => {
            const method = v.value.property.name;
            usedMethods.push(method);
            j(v).replaceWith(j.identifier(method));
          });
        path.value.specifiers = path.value.specifiers.filter(s => s.type !== 'ImportDefaultSpecifier');
        // add named imports
        usedMethods
          // it might already be imported
          .filter(method => !path.value.specifiers.some(s => s.imported.name === method))
          .forEach(method => path.value.specifiers.push(j.importSpecifier(j.identifier(method))));
        j(path).replaceWith(path.value);
      })
      .toSource()
  );
}

//
// before
import Decorator, {withReact} from '../decorators';

const MyThing = Decorator.withReact(1);
const OtherThing = Decorator.withStateful(1);

// after
import { withReact, withStateful } from '../decorators';

const MyThing = withReact(1);
const OtherThing = withStateful(1);