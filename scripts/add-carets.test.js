import path from 'path'
import fs from 'fs-extra'
import execa from 'execa'

const folder = path.join(__dirname, 'add-carets-test')
const packageFile = path.join(folder, 'package.json')

test('it adds carets', async () => {
    await fs.remove(folder)
    await fs.outputJSON(packageFile, {
        dependencies: {
            'fs-extra': '0.0.1',
            thing: 'what-is-this-version',
        },
        devDependencies: {
            'fs-extra': '0.0.2',
        },
        peerDependencies: {
            thing: '0.3.0',
            otherThing: '^0.5.0',
        },
    })
    await execa('node', ['../add-carets'], { cwd: folder })
    const newContents = await fs.readJSON(packageFile)
    expect(newContents).toEqual({
        dependencies: {
            'fs-extra': '^0.0.1',
            thing: 'what-is-this-version',
        },
        devDependencies: {
            'fs-extra': '^0.0.2',
        },
        peerDependencies: {
            thing: '^0.3.0',
            otherThing: '^0.5.0',
        },
    })
})
