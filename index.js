#!/usr/bin/env node --harmony

//http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm

const program = require('commander');
const shell = require('shelljs');

console.log('Hello, world!');

program
	.version('0.1.0')
	.command('build')
	.description('build lambda function and generate lambda function zip file')
	.action(function (env) {
		console.log('starting build', env);
		shell.exec('pwd');
		shell.exec("npm install", function (error, stdout, stderr) {
			if (error !== null) {
				// shell.exec('ls -al ./node_modules/build-scripts/gulpfile.js');
				shell.exec('./node_modules/gulp/bin/gulp.js es6 --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program.parse(process.argv);

