module.exports = {
	name: 'eval',
	exec: function (message, args) {
		const expr = args.join(' ');
		eval(expr);
	}
}