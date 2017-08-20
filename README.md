# build-scripts

Centralized development commands for building ES6 modules and common development tasks.

## Install

```
// locally
npm install github:ControlSpaceSoftware/build-scripts.git --save-dev

// globally
npm install github:ControlSpaceSoftware/build-scripts.git -g
```

### Locally Installed Usage

```
./node_modules/build-scripts <cmd> <options>
```

### Globally Installed Usage

```
build-scripts <cmd> <options>
```

## Commands

```
build-scripts -h

  Usage: index [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    clean           remove ./dist directory and ./dist.zip file
    zip             zip ./dist directory into ./dist.zip file
    build-lambda    build lambda function in /dist directory
    upload-lambda   build and deploy function to aws lambda - function must already exist
    build           runs babel src -o lib // src/es6 to lib/es5
    test            runs mocha test
    test-watch      runs mocha test with the watch option
    commit          runs build, test and commit interactive so you enter commit message
    patch           update package version
    push            git push to origin
    patch-push      update package version and git push to origin - runs build and test first

```

## Your Project Structure

The commands are opinionated by design as follows:

javascript .js files are ES6 code
use ES6 modules (import / export)
use ./src directory for all source code
use ./lib directory for all es5 code
use babel to transform es6 to es5 code
use ./dist directory for distribution code
use engine node v6+
conform to all npm conventions
use npm as primary build tooling
use mocha for testing

```
/project
	package.json
	src
	lib
	test
	dist

```