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
			if (!error) {
				shell.exec('./node_modules/gulp/bin/gulp.js clean --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program
	.command('zip')
	.description('zip ./dist directory into ./dist.zip file')
	.action(function () {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('./node_modules/gulp/bin/gulp.js zip --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program
	.command('build-lambda')
	.description('build lambda function in /dist directory')
	.action(function () {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('./node_modules/gulp/bin/gulp.js build --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

program
	.command('upload-lambda')
	.description('build and deploy function to aws lambda - function must already exist')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('./node_modules/gulp/bin/gulp.js upload --gulpfile ./node_modules/build-scripts/gulpfile.js');
			}
		});
	});

/*
	  "build": "babel src --out-dir lib",
 */
program
	.command('build')
	.description('runs babel src -o lib // src/es6 to lib/es5')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('npm run build');
			}
		});
	});

/*
	  "test": "mocha --compilers js:babel-core/register test",
 */
program
	.command('test')
	.description('runs mocha test')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('run npm test');
			}
		});
	});

/*
	  "test:watch": "mocha --compilers js:babel-core/register --watch test",
 */
program
	.command('test-watch')
	.description('runs mocha test with the watch option')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('npm run test:watch');
			}
		});
	});

/*
	  "commit": "npm run build && npm run test && git commit",
 */
program
	.command('commit')
	.description('runs build, test and commit interactive so you enter commit message')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('npm run commit');
			}
		});
	});

/*
	  "patch": "npm version patch",
 */
program
	.command('patch')
	.description('update package version')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('npm run patch');
			}
		});
	});

/*
	  "push": "git push origin --follow-tags",
 */
program
	.command('push')
	.description('git push to origin')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('npm run push');
			}
		});
	});

/*
	  "patch:push": "npm run build && npm run test && npm run patch && npm run push"
 */
program
	.command('patch-push')
	.description('update package version and git push to origin - runs build and test first')
	.action(function (env) {
		shell.exec("npm install", function (error, stdout, stderr) {
			if (!error) {
				shell.exec('npm run patch:push');
			}
		});
	});

program.parse(process.argv);
