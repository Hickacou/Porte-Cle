const { writeFileSync } = require('fs');
module.exports = {
	name: 'save',
	exec: async function (message, args) {
		message.client.busy = true;
		message.channel.send(`Je commence la sauvegarde de tous les messages dans ${message.channel}\nCe processus risque de prendre un certain temps s'il y'a beaucoup de messages.`);
		const saved = await save(message.channel);
		writeFileSync(`./saves/${message.guild.id}.${message.channel.id}.${Date.now()}.json`, JSON.stringify(saved), { encoding: 'utf-8' });
		message.channel.send('🔑 Tout est sauvegardé ! 🔑');
		message.client.busy = false;
	}
}


async function save(channel, before, current) {
	if (!before)
		current = { authors: {}, messages: {} };
	const fetched = await (before ? channel.messages.fetch({ before }) : channel.messages.fetch());
	fetched.each(msg => {
		if (!Object.keys(current.authors).includes(msg.author.id)) {
			current.authors[msg.author.id] = {
				id: msg.author.id,
				tag: msg.author.tag,
				avatar: msg.author.displayAvatarURL({ dynamic: true, size: 4096 })
			}
		}
		current.messages[msg.id] = {
			at: msg.createdTimestamp,
			author: msg.author.id,
			content: msg.cleanContent,
			id: msg.id,
			pinned: msg.pinned
		}
		if (msg.attachments.size > 0)
			current.messages[msg.id].attachments = msg.attachments.map(a => a.url);
	});
	console.log(`Messages récupérés dans #${channel.name} : ${Object.keys(current.messages).length}`);
	return fetched.size < 50 ? current : save(channel, fetched.last().id, current);
}