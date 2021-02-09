const { readFileSync, writeFileSync } = require('fs');

module.exports = {
	name: 'txt',
	exec: function (message, args) {
		const file = args[0];
		let data;
		try {
			const read = readFileSync(`./saves/${file}.json`, { encoding: 'utf-8' });
			data = JSON.parse(read);
		} catch (err) {
			message.channel.send(`Problème clé.\n \`\`\`js\n${err.toString()}\`\`\``);
		}
		message.channel.send('Génération du fichier txt...');
		let txt = '';
		Object.values(data.messages).forEach(msg => {
			txt += `[${formatDate(new Date(msg.at))}] ${data.authors[msg.author].tag}\n${msg.content}\n`;
			if (msg.attachments)
				txt += `(Pièces jointes: ${msg.attachments.join(' ')})\n`;
		});
		writeFileSync(`./saves/${file}.txt`, txt, { encoding: 'utf-8' });
		message.channel.send('🔑 Fichier txt généré ! 🔑')
	}
}


function formatDate(date) {
	const z = n => `${n < 10 ? '0' : ''}${n}`;
	return `${z(date.getDate())}/${z(date.getMonth() + 1)}/${date.getFullYear()} ${z(date.getHours())}:${z(date.getMinutes())}:${z(date.getSeconds())}`;
}