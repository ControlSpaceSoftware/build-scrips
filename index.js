#!/usr/bin/env node --harmony

//http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm

const program = require('commander');
const shell = require('shelljs');

shell.exec('pwd');

program
	.version('0.1.0')
	.command('clean')
	.description('remove ./dist directory and ./dist.zip file')
	.action(function () {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (error !== null) {
				// shell.exec('ls -al ./node_modules/build-scripts/gulpfile.js');
				shell.exec('./node_modules/gulp/bin/gulp.js clean --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program
	.version('0.1.0')
	.command('build')
	.description('build lambda function in /dist directory')
	.action(function () {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (error !== null) {
				// shell.exec('ls -al ./node_modules/build-scripts/gulpfile.js');
				shell.exec('./node_modules/gulp/bin/gulp.js build --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program
	.version('0.1.0')
	.command('upload-lambda')
	.description('build and deploy function to aws lambda - function must already exist')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (error !== null) {
				// shell.exec('ls -al ./node_modules/build-scripts/gulpfile.js');
				shell.exec('./node_modules/gulp/bin/gulp.js upload --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program.parse(process.argv);
