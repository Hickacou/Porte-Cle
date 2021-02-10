const { MessageEmbed } = require('discord.js');
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
		const messages = Object.values(data.messages)
		const authors = Object.values(data.authors);

		const authorsCount = authors.length;
		const total = messages.length;
		let characters = 0;
		messages.forEach(msg => { characters += msg.content.replace(/^<a?:\w+:\d+>$/, '🔑').length });
		let emotes = 0;
		messages.forEach(msg => { emotes += (msg.content.match(/^<a?:\w+:\d+>$/g) || []).length; });

		let authorsValues = [];
		authors.forEach(author => {
			const msgs = messages.filter(m => m.author === author.id);
			authorsValues.push({
				tag: author.tag,
				count: msgs.length,
				rate: msgs.length / total
			});
		});
		authorsValues = authorsValues.sort((a, b) => b.count - a.count);
		const embed = new MessageEmbed()
			.setTitle('Statistiques pour cette save')
			.setColor('2f3136')
			.setFooter(`Save ${id}`)
			.addField('Nombre total de messages', total, true)
			.addField('Nombre total de caractères', characters, true)
			.addField('Nombre total d\'emotes (non standardes)', emotes, true)
			.addField('Nombre d\'auteurs', authorsCount, true)
			.addField('Messages par auteur :', '.', false);
		authorsValues.forEach((a, i) => {
			const line = `${i + 1}. __${a.tag}__ - **${a.count}** (${(a.rate * 100).toFixed(2)}%)\n`;
			if (embed.fields[embed.fields.length - 1].value.length + line.length >= 1024)
				embed.addField('\u200B', line, false);
			else
				embed.fields[embed.fields.length - 1].value += line;
		});
		embed.fields[4].value = embed.fields[4].value.slice(1);
		message.channel.send(embed);
	}
}