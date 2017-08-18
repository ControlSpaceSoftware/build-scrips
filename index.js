#!/usr/bin/env node --harmony

console.log('Hello, world!');



const child_process = require('child_process');

child_process.exec("npm install -g", function (error, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if (error !== null) {
		console.log('exec error: ' + error);
	}
});

child_process.exec("./node_modules/build-scripts/node_modules/gulp/bin/gulp.js ./node_modules/build-scripts/gulpfile.js", function (error, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if (error !== null) {
		console.log('exec error: ' + error);
	}
});
