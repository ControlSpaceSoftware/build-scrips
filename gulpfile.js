/*global require*/

/**
 * Created by onvelocity on 8/8/17.
 */
const fs = require('fs');
const zip = require('gulp-zip');
const del = require('del');
const chalk = require('chalk');
const gulp = require('gulp');
const file = require('gulp-file');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const install = require('gulp-install');
const camelCase = require('lodash.camelcase');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

const AWS = require('aws-sdk');

const buildScriptsPkg = require('./package.json');
const lambdaFunctionPkg = require('../../package.json');
const lambdaFunctionName = camelCase(lambdaFunctionPkg.name);

// parameters from package.json files
const globals = Object.assign({}, buildScriptsPkg.globals, lambdaFunctionPkg.globals);
const region = (lambdaFunctionPkg.aws && lambdaFunctionPkg.aws.region) || buildScriptsPkg.aws.region;

// First we need to clean out the dist folder and remove the compiled zip file.
gulp.task('clean', function (cb) {
	return del(['../../dist', '../../dist.zip'], {force: true}, cb);
});

// The js task could be replaced with gulp-coffee as desired.
gulp.task('js', function () {
	return gulp.src('../../src/*.js')
		.pipe(gulp.dest('../../dist/'))
});

gulp.task('es6', function () {
	return rollup({
		entry: '../../src/index.js',
		globals,
		plugins: [
			babel({
				presets: [
					[
						"es2015", {
						"modules": false
					}
					]
				],
				babelrc: false,
				exclude: 'node_modules/**'
			})
		]
	})
		.then((bundle) => {
			return bundle.generate({
				format: 'umd',
				moduleName: 'myModuleName'
			})
		})
		.then((gen) => {
			return file('index.js', gen.code, {src: true})
				.pipe(gulp.dest('../../dist/'))
		});
});

// Here we want to install npm packages to dist, ignoring devDependencies.
gulp.task('npm', function () {
	return gulp.src('../../package.json')
		.pipe(gulp.dest('../../dist/'))
		.pipe(install({production: true}));
});

// Next copy over environment variables managed outside of source control.
gulp.task('env', function () {
	return gulp.src('../../config.env.production')
		.pipe(rename('.env'))
		.pipe(gulp.dest('../../dist'))
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

	const functionName = lambdaFunctionName;

	lambda.getFunction({FunctionName: functionName}, function (err, data) {
		if (err) {
			if (err.statusCode === 404) {
				console.log(chalk.red(`Unable to find lambda function ${functionName}. Create the function on AWS before uploading this function.`));
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
					gutil.log(chalk.red(err.message));
					console.error(err);
				}
				cb();
			});
		});
	});

});

// The key to deploying as a single command is to manage the sequence of events.
gulp.task('build', gulp.series(['clean', 'es6', 'npm', 'zip']));
gulp.task('upload', gulp.series(['clean', 'es6', 'npm', 'zip', 'upload']));
