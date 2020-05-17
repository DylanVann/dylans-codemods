# dylans-codemods

A collection of transforms for use with
[facebook/jscodeshift](https://github.com/facebook/jscodeshift).

## Usage

Install `jscodeshift`:

```bash
yarn global add jscodeshift
```

Point jscodeshift at a transform:

```bash
jscodeshift -t https://raw.githubusercontent.com/DylanVann/dylans-codemods/master/transforms/babel-plugin-jsx-control-statements-to-javascript.js --extensions jsx src
```
