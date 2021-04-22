// bot prefix (i.e. !ping)
const prefix = '!';

// importing librairies
const Discord = require('discord.js');
const config = require('./config.json');

// event methods
const onReady = () => {
  console.log('Starting that shit!');
};

const onMessage = (message) => {
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
}

// helper methods
const buildCmd = (command) => {
  return prefix + command;
}

// building client
const client = new Discord.Client();
// hooking events
client.on('ready', onReady);
client.on('message', onMessage);
// login to discord
client.login(config.BOT_TOKEN);