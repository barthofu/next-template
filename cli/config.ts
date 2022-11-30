// @ts-ignore
import packageJson from '../package.json'

export const info = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
}

export const repositories = {

    templates: {
        owner: 'barthofu',
        repo: 'starters',
        branch: 'main',
    }
}