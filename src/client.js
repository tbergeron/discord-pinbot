const Discord   = require('discord.js');
const config    = require('../config.json');
const prefix    = (config.PREFIX) ? config.PREFIX : '!';
const onMessage = require('./commands');

module.exports = () => {
  // event methods
  const onReady = () => {
    console.log('DiscordPinBot started.');
  };

  // building client
  const client = new Discord.Client();

  // hooking events
  client.on('ready', onReady);
  client.on('message', onMessage);

  // login to discord
  client.login(config.BOT_TOKEN);
};