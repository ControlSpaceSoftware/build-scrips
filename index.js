#!/usr/bin/env node --harmony

//http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
/*
NOTE
require context is build-scripts
shelljs context is build-scripts/../..
 */

const path = require('path');
const program = require('commander');
const shell = require('shelljs');
const chalk = require('chalk');

const commands = require('./commands.json');
const currentPath = path.join(process.cwd(), './package.json');
const projectPackageJson = require(currentPath);

const BABEL_RC = {
	"babel": {
		"presets": [
			"env"
		]
	}
};

if (!(projectPackageJson && typeof projectPackageJson.name === 'string')) {
	console.log(chalk.red('missing package.json file. fatal error exiting.'));
	return;
}

const isBuildScriptsPackage = projectPackageJson.name === 'build-scripts';

if (!isBuildScriptsPackage) {

	shell.exec('pwd');
	console.log(`process.cwd: ${process.cwd()}`);
	console.log('using package.json file:', currentPath);
	console.log(JSON.stringify(projectPackageJson, null, 4));

}

if (!(projectPackageJson && typeof projectPackageJson.babel === 'object')) {
	console.log(chalk.red('package.json is missing babel options.\nAdd following to your package.json:'));
	console.log(JSON.stringify(BABEL_RC, null, 4));
	console.log('fatal error exiting.');
	return;
}

program
	.version('0.1.0');

commands.forEach(({command, description, shellExec, options = []}) => {

	const commandDefinition = program.command(command);

	commandDefinition.description(description);

	const optionDefinitions = [];
	options.forEach((option) => {

		commandDefinition.option(option.flags, option.description);

		/^(-[^\W]*),\W+(--[^\W]*)\W+\[([^\]]*)/.exec(option.flags);
		optionDefinitions.push({
			alias: RegExp.$1,
			option: RegExp.$2,
			name: RegExp.$3
		});

	});

	commandDefinition.action(function (env) {
		let execDefinition = shellExec;
		optionDefinitions.forEach((option) => {
			if (env.hasOwnProperty(option.name)) {
				const value = env[option.name];
				const replace = (option.alias || option.option) + (value ? ' "' + value + '"': '');
				const re = new RegExp(`\\$${option.name}(\\W|$)`, 'g');
				execDefinition = execDefinition.replace(re, replace);
			}
		});
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('pwd');
				console.log(`current dir: ${process.cwd()}`);
				console.log(execDefinition);
				shell.exec(execDefinition);
			}
		});
	});

});

program.parse(process.argv);
