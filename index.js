#!/usr/bin/env node --harmony

//http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
/*
notes

require context is build-scripts
shelljs context is build-scripts/../..

 */
const program = require('commander');
const shell = require('shelljs');
const chalk = require('chalk');

shell.exec('pwd');
console.log(`current dir: ${process.cwd()}`);

const projectPackageJson = require('./package.json');
console.log(JSON.stringify(projectPackageJson, null, 4));

const BABEL_RC = {
	"babel": {
		"presets": [
			"env"
		]
	}
};

if (!(projectPackageJson && typeof projectPackageJson.babel === 'object')) {
	console.log(chalk.red('package.json is missing babel options.\nAdd following to your package.json:'));
	console.log(JSON.stringify(BABEL_RC, null, 4));
	console.log('fatal error exiting.');
	return;
}

// shell.ln('-s', './node_modules/build-scrips/index.js', './build-scripts');

const commands = [
	{
		command: 'test',
		description: 'runs mocha test',
		shellExec: './node_modules/mocha/bin/mocha --compilers js:babel-core/register test'
	},
	{
		command: 'test-watch',
		description: 'runs mocha test with the watch option',
		shellExec: './node_modules/mocha/bin/mocha --compilers js:babel-core/register --watch test'
	},
	{
		command: 'commit',
		description: 'runs build, test and commit interactive so you enter commit message',
		shellExec: 'npm run build && npm run test && git add --all . && git commit',
		options: [
			{
				flags: '-m, --message',
				description: 'commit message'
			}
		]
	},
	{
		command: 'patch',
		description: 'update package version',
		shellExec: 'npm version patch'
	},
	{
		command: 'push',
		description: 'git push to origin',
		shellExec: 'git push origin --follow-tags'
	},
	{
		command: 'patch-push',
		description: 'update package version and git push to origin - runs build and test first',
		shellExec: 'npm run build && npm run test && npm run patch && npm run push'
	},
	{
		command: 'clean',
		description: 'remove ./dist directory and ./dist.zip file',
		shellExec: './node_modules/gulp/bin/gulp.js clean --gulpfile ./node_modules/build-scripts/lambda.js'
	},
	{
		command: 'zip',
		description: 'zip ./dist directory into ./dist.zip file',
		shellExec: './node_modules/gulp/bin/gulp.js zip --gulpfile ./node_modules/build-scripts/lambda.js'
	},
	{
		command: 'build-lambda',
		description: 'build lambda function in /dist directory',
		shellExec: './node_modules/gulp/bin/gulp.js build --gulpfile ./node_modules/build-scripts/lambda.js'
	},
	{
		command: 'upload-lambda',
		description: 'build and deploy function to aws lambda - function must already exist',
		shellExec: './node_modules/gulp/bin/gulp.js upload --gulpfile ./node_modules/build-scripts/lambda.js'
	},
	{
		command: 'build',
		description: 'runs babel src -o lib // src/es6 to lib/es5',
		shellExec: './node_modules/babel-cli/bin/babel.js src --out-dir lib'
	}
];

program
	.version('0.1.0');

commands.forEach(({command, description, shellExec, options = []}) => {
	program
		.command(command)
		.description(description);
	if (options.length) {
		options.forEach((option) => program.option(option.flags, option.description));
	}
	program.action(function (env) {
		shell.exec('pwd');
		console.log(`current dir: ${process.cwd()}`);
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('pwd');
				console.log(`current dir: ${process.cwd()}`);
				console.log(shellExec);
				shell.exec(shellExec);
			}
		});
	});
});

program.parse(process.argv);
