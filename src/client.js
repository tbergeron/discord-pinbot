const Discord   = require('discord.js');
const config    = require('../config.json');
const onMessage = require('./commands');
const prefix    = (config.PREFIX) ? config.PREFIX : '!';

module.exports = () => {
  // event methods
  const onReady = () => {
    console.log('Starting that shit!');
  };

  // building client
  const client = new Discord.Client();
  // hooking events
  client.on('ready', onReady);
  client.on('message', onMessage);
  // login to discord
  client.login(config.BOT_TOKEN);
};