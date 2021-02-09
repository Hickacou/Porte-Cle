const { Client } = require('discord.js');
const { prefix, token, whitelist } = require('./conf.json');
const { readdirSync, existsSync, mkdirSync, } = require('fs');
const client = new Client();

client.on('ready', function () {
	console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('message', function (message) {
	if (message.author.bot
		|| !whitelist.includes(message.author.id)
		|| !message.content.startsWith(prefix)
	)
		return;
	if (client.busy)
		return message.channel.send('Je suis occupé là.');
	const args = message.content.slice(prefix.length).trim().split(' ');
	const cmd = args.shift().toLowerCase();
	if (client.commands.has(cmd))
		client.commands.get(cmd).exec(message, args);
});


const files = readdirSync('./commands', { encoding: 'utf-8' }).filter(f => f.endsWith('.js'));
client.commands = new Map();
files.forEach(file => {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
});
if (!existsSync('saves'))
	mkdirSync('saves');

client.login(token);