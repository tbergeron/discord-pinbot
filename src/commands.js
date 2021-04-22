const api = require('./api');

module.exports = (message) => {
  // making sure message author is not a bot
  if (message.author.bot) return;
  // filtering to keep only messages that actually begins with prefix
  if (!message.content.startsWith(prefix)) return;

  // disecting and normalizing command
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // parsing commands
  if (command === 'ping') {
    message.reply('pong');
  }

  if (command === 'getargs') {
    message.reply(args.join(' '));
  }
};