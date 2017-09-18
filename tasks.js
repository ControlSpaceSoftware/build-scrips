/*global require*/

/**
 * Created by onvelocity on 8/8/17.
 */
const fs = require('fs');
const zip = require('gulp-zip');
const del = require('del');
const chalk = require('chalk');
const gulp = require('gulp');
const install = require('gulp-install');
const camelCase = require('lodash.camelcase');

const AWS = require('aws-sdk');

const scriptsPackageJson = require('./package.json');
const projectPackageJson = require('../../package.json');
const projectPackageClassName = camelCase(projectPackageJson.name);

// parameters from package.json files
const region = (projectPackageJson.aws && projectPackageJson.aws.region) || scriptsPackageJson.aws.region;

// First we need to clean out the dist folder and remove the compiled zip file.
gulp.task('clean', function (cb) {
	return del(['../../dist', '../../dist.zip'], {force: true}, cb);
});

gulp.task('copy', function () {
	return gulp.src('../../lib/**/*')
		.pipe(gulp.dest('../../dist'));
});

gulp.task('copy-src-resources-to-lib', function () {
	return gulp.src(['../../src/**/*', '!**/*.js'])
		.pipe(gulp.dest('../../lib'));
});

// Here we want to install npm packages to dist, ignoring devDependencies.
gulp.task('npm', function () {
	return gulp.src('../../package.json')
		.pipe(gulp.dest('../../dist/'))
		.pipe(install({production: true}));
});

// Now the dist directory is ready to go. Zip it.
gulp.task('zip', function () {
	return gulp.src(['../../dist/**/*', '!../../dist/package.json', '../../dist/.*'])
		.pipe(zip('dist.zip'))
		.pipe(gulp.dest('../../'));
});

// Per the gulp guidelines, we do not need a plugin for something that can be
// done easily with an existing node module. #CodeOverConfig
//
// Note: This presumes that AWS.config already has credentials. This will be
// the case if you have installed and configured the AWS CLI.
//
// See http://aws.amazon.com/sdk-for-node-js/
gulp.task('upload', function (cb) {

	AWS.config.region = region;

	const lambda = new AWS.Lambda();

	const functionName = projectPackageClassName;

	lambda.getFunction({FunctionName: functionName}, function (err, data) {
		if (err) {
			if (err.statusCode === 404) {
				console.log(chalk.red(`\nUnable to find lambda function ${functionName}.\nCreate the function on AWS before uploading this function.\n`));
				console.error(err);
			} else {
				console.log(chalk.red(`AWS API request failed.`));
				console.error(err);
			}
			return cb();
		}

		const current = data.Configuration;

		console.log('config', JSON.stringify(current, null, 2));

		const params = {
			FunctionName: functionName
		};

		fs.readFile('../../dist.zip', function (err, data) {
			params['ZipFile'] = data;
			lambda.updateFunctionCode(params, function (err, data) {
				if (err) {
					console.log(chalk.red(err.message));
					console.error(err);
				}
				cb();
			});
		});
	});

});

gulp.task('package', gulp.series(['clean', 'copy', 'npm', 'zip']));
