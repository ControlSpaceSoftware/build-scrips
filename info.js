
const commands = require('./commands.json');

const scripts = commands.map((command) => {
	const script = {};
	script[command.command] = `build-scripts ${command.command}`;
	return script;
});

console.log('Add scripts to your package.json file:');
console.log(JSON.stringify(scripts, null, 5));
