const config = require('../config.json');
const prefix = (config.PREFIX) ? config.PREFIX : '!';

// requiring API
const api = require('./api');

// commands
const ping = (c, a, m) => {
  if (c === 'ping') {
    m.reply('pong');
  }
};

const getArgs = (c, a, m) => {
  if (c === 'getargs') {
    m.reply(a.join(' '));
  }
};

const getData = (c, a, m) => {
  if (c === 'getdata') {
    if (a[0] !== undefined) {
      const key = a[0];
      const response = api.getData(key);
      m.reply(`data for Key: **${key}** Value: **${response}**`);
    }
  }
};

const saveData = (c, a, m) => {
  if (c === 'savedata') {
    if ((a[0] !== undefined) && (a[1] !== undefined)) {
      const key   = a[0];
      const value = a[1]; // TODO: handle multiple arguments
      api.saveData(key, value);
      m.reply(`saved Key: **${key}** Data: **${value}**`);
    }
  }
};

const getDump = (c, a, m) => {
  if (c === 'getdump') {
    const dump = JSON.stringify(api.getDump());
    m.reply(`dumping entire database: **${dump}**`);
  }
};

// exposed command implementation
module.exports = (message) => {
  // making sure message author is not a bot
  if (message.author.bot) return;
  // filtering to keep only messages that actually begins with prefix
  if (!message.content.startsWith(prefix)) return;

  // disecting and normalizing command
  const commandBody = message.content.slice(prefix.length);
  const args        = commandBody.split(' ');
  const command     = args.shift().toLowerCase();

  console.log(command, args);

  // hooking commands
  ping    (command, args, message);
  getArgs (command, args, message);
  getData (command, args, message);
  saveData(command, args, message);
  getDump (command, args, message);
};