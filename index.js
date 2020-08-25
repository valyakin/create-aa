#!/usr/bin/env node
/* eslint-disable no-console */

const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const execSync = require('child_process').execSync
const validateProjectName = require('validate-npm-package-name')

const agentName = process.argv[2]

if (process.argv.length !== 3) {
	console.error(chalk.green('Usage: create-aa'), chalk.cyan('<directory-name>'))
	process.exit(1)
}

const validationResult = validateProjectName(agentName)

if (!validationResult.validForNewPackages) {
	console.error(chalk.red(`Cannot create a agent named '${agentName}' because of npm naming restrictions:\n`),
		[
			...(validationResult.errors || []),
			...(validationResult.warnings || [])
		])
	console.error(chalk.red('Please choose a different agent name.'))
	process.exit(1)
}

console.log(chalk.green(`Creating '${agentName}' from template...`))

fs.ensureDirSync(agentName)
fs.copySync(path.join(__dirname, './template'), agentName)
fs.rename(path.join(agentName, '_gitignore'), path.join(agentName, '.gitignore'))

const packageJson = require(path.join(__dirname, './template/package.json'))
fs.writeFileSync(
	path.join(agentName, 'package.json'),
	JSON.stringify({
		name: agentName,
		...packageJson
	}, null, 2) + os.EOL
)

console.log(chalk.green(`Installing dependencies...`))

const isUsingYarn = shouldUseYarn()

process.chdir(agentName)
installDependencies().then(() => {
	console.log(chalk.green('Success! Run:'))

	if (isUsingYarn) {
		console.log(chalk.cyan(`\tcd ${agentName} && yarn test`))
	} else {
		console.log(chalk.cyan(`\tcd ${agentName} && npm run test`))
	}

	console.log(chalk.green('to start test examples'))
}).catch(e => {
	console.error(chalk.red('Error:'), chalk.red(e.message || e))
})

function installDependencies () {
	const command = isUsingYarn ? 'yarn' : 'npm'
	const args = isUsingYarn ? [] : ['install']

	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: 'inherit' })
		child.on('close', code => {
			if (code !== 0) {
				reject(new Error(`installing dependencies has exited with non-zero code:`, code))
				return
			}
			resolve()
		})
	})
}

function shouldUseYarn () {
	try {
		execSync('yarnpkg --version', { stdio: 'ignore' })
		return true
	} catch (e) {
		return false
	}
}
