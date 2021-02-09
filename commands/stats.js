const { readFileSync, writeFileSync } = require('fs');
module.exports = {
	name: 'stats',
	exec: function (message, args) {
		const id = args[0];
		let data;
		try {
			const read = readFileSync(`./saves/${id}.json`, { encoding: 'utf-8' });
			data = JSON.parse(read);
		} catch (err) {
			message.channel.send(`Problème clé.\n \`\`\`js\n${err.toString()}\`\`\``);
		}
		let total = 0;
		Object.values(data.messages).forEach(msg => { total += msg.content.replace(/^<a?:(\w+):(\d+)>$/, '🔑').length });
		message.channel.send(`${total} caractères.`);
	}
}