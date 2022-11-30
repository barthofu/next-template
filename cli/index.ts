#!/usr/bin/env node

import chalk from "chalk"
import { program } from "commander"
import { mkdir } from "fs/promises"
import inquirer from "inquirer"
import path from "path"
import simpleGit from "simple-git"
import { spawn } from "spawnise"

import { info, repositories } from "@config"
import { downloadRepoFromGithub, getTemplates, getVariantsOfTemplate, logger } from "@utils"
import { existsSync } from "fs"

const git = simpleGit()

program
    .name(info.name)
    .description(info.description)
    .version(info.version)

    .option('-v, --verbose')

    .argument('[template]', 'the template to generate')
    .argument('[variant]', 'the variant of the template to generate')

    .option('--name <name>', 'the name of the project')
    .option('--no-deps', 'do not install dependencies')
    .option('--no-git', 'do not initialize git repository')
    .option('--current-dir, -c', 'initialize the project in the current directory')

    .action(async (template: string | null, variant: string | null, options) => {

        const isCurrentDir = options.C ?? false
        const name = isCurrentDir ? '.' : options.name || template

        // guards
        if (name && existsSync(path.resolve(name))) return logger.failure('A folder with this name already exists')

        // 1. Define the template to generate along with its variant 

        const templates = await getTemplates()

        if (!template) {

            const answers = await inquirer.prompt({
                type: 'list',
                name: 'template',
                message: 'Which template do you want to generate?',
                choices: templates
            })

            template = answers.template

        } else if (!templates.includes(template)) {
            return logger.failure('Template not found')
        }

        template = template! // at this point in the program, we know that the template is not null

        const variants = await getVariantsOfTemplate(template)

        if (!variant) {
            
            const answers = await inquirer.prompt({
                type: 'list',
                name: 'variant',
                message: 'Which variant do you want to generate?',
                choices: variants
            })

            variant = answers.variant

        } else if (!variants.includes(variant)) {
            return logger.failure('Variant not found')
        }

        // 2. Download the template

        if (!isCurrentDir) await mkdir(name)

        const success = await downloadRepoFromGithub(
            name,
            repositories.templates,
            `templates/${template}/${variant}`,
            4
        )

        // 3. Install dependencies
        if (options.deps) {

            logger.spinner.start('Installing dependencies...')

            await spawn('npm', ['install'], {
                env: process.env,
                cwd: path.resolve(name),
                stdio: 'ignore'
            })
        }

        // 4. Initialize git repository
        if (options.git) {

            logger.spinner.text = 'Initializing git repository...'

            await git.cwd(path.resolve(name))
            await git.init()
            await git.add('.')
            await git.commit('init project from barthofu/tscord')
        }

        logger.success(`Successfully initialized ${chalk.bold(name)}!`)
    })

async function run() {

    program.parse(process.argv)

}

run()

