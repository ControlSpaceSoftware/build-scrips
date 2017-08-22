
const commands = Array.from(require('./commands.json'));

const scripts = commands.reduce((scripts, command) => {
	scripts[command.command] = `build-scripts ${command.command}`;
	return scripts;
}, {
	help: '-h',
	scripts: 'node info'
});

console.log('Add scripts to your package.json file:');
console.log(JSON.stringify(scripts, null, 5));
