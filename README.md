# build-scripts

Centralized development commands for building ES6 modules and common development tasks.

## Install

```
// locally **prefered**
npm install github:ControlSpaceSoftware/build-scripts.git --save-dev

// globally
npm install github:ControlSpaceSoftware/build-scripts.git -g
```

### Usage

```
build-scripts command [options]
```

## Commands

```
  Usage: build-scripts -h
  Usage: build-scripts [command] -h
  Usage: build-scripts [options] [command]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    build              runs babel src -o lib // src/es6 to lib/es5
    test               runs mocha test
    test-watch         runs mocha test with the watch option
    commit [options]   runs build, test and commit interactive so you enter commit message
    patch              update package version
    push               git push to origin
    patch-push         update package version and git push to origin - runs build and test first
    clean              remove ./dist directory and ./dist.zip file
    zip                zip ./dist directory into ./dist.zip file
    build-lambda       build lambda function in /dist directory
    upload-lambda      build and deploy function to aws lambda - function must already exist
```

## Your Project Structure

The commands are opinionated by design as follows:

* javascript .js files are ES6 code
* use ES6 modules (import / export)
* use ./src directory for all source code
* use ./lib directory for all es5 code
* use babel to transform es6 to es5 code
* use ./dist directory for distribution code
* use engine node v6+
* conform to all npm conventions
* use npm as primary build tooling
* use mocha for testing
* no environment variables in code or config (environment should not be in github)


```
/project
	package.json
	src
	lib
	test
	dist

```

## Your package.json File

Your package.json file must reference set "main" to point to the es5 code in lib directory.
Your package.json file must specify the {"babel": {"presets": ["env"]}}.

Add convenience scripts so you can conveniently run commands from npm, like, npm run test-watch.
Note to pass options down to the underlying script you use --, like, npm run commit -- -m "commit msg".

```javascript
{
    "scripts": {
        "help": "build-scripts -h",
        "build": "build-scripts build",
        "test": "build-scripts test",
        "test-watch": "build-scripts test-watch",
        "commit": "build-scripts commit",
        "patch": "build-scripts patch",
        "push": "build-scripts push",
        "patch-push": "build-scripts patch-push",
        "clean": "build-scripts clean",
        "zip": "build-scripts zip",
        "build-lambda": "build-scripts build-lambda",
        "upload-lambda": "build-scripts upload-lambda"
    }
}
```

# Test Coverage
To add test coverage to your project modify your package.json test script.
Put `nyc --reporter=html --reporter=text ` in from of the `build-scripts test` command.

```
		"test": "nyc --reporter=html --reporter=text build-scripts test",
```

The nyc module should be installed automatically for you by build-scripts.
Sometimes you may need to rerun `npm i -D github:ControlSpaceSoftware/build-scripts`.

Or you can install nyc local to your project as a `-D` or `--save-dev` dependency.