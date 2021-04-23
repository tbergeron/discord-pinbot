const config = require('../config.json');
const prefix = (config.PREFIX) ? config.PREFIX : '!';

// requiring API
const api = require('./api');

// reply with integrated output to console
const reply = (m, c) => {
  console.log('[replying]:', c);
  m.reply(c);
};

// commands
const ping = (c, a, m) => {
  if (c === 'ping') {
    reply(m, 'pong');
  }
};

const getArgs = (c, a, m) => {
  if (c === 'getargs') {
    reply(m, a.join(' '));
  }
};

const getDump = (c, a, m) => {
  if (c === 'getdump') {
    const dump = JSON.stringify(api.getDump());
    reply(m, `dumping entire database: **${dump}**`);
  }
};

const pin = (c, a , m) => {
  if (c === 'pin') {
    if ((a[0] !== undefined) && (a[1] !== undefined)) {
      const user_id     = m.author.id;
      const message_url = a[0];
      const keywords    = a[1]; // TODO: handle multiple arguments

      api.pin(user_id, message_url, keywords);

      reply(m, `Pinned message: **${message_url}** for UserId: **${user_id}** Keywords: **${keywords}**`);
    }
  }
};

const unpin = (c, a, m) => {
  if (c === 'unpin') {
    if (a[0] !== undefined) {
      const user_id     = m.author.id;
      const message_url = a[0];

      api.unpin(user_id, message_url);

      reply(m, `Unpinned message: **${message_url}** for UserId: **${user_id}**`);
    }
  }
};

const search = (c, a, m) => {
  if (c === 'searchpin') {
    if (a[0] !== undefined) {
      const user_id     = m.author.id;
      const keywords    = a[0];

      const pins = api.search(user_id, keywords);

      let stringifiedPins = '';
      pins.forEach((pin) => {
        // strip user id
        const splitString = pin[0].split('_');
        stringifiedPins += `${splitString[1]} --- `;
      });

      reply(m, `Searching in pins for **${keywords}** for UserId: **${user_id}**. Result: ${stringifiedPins}`);
    }
  }
};

// TODO: make unPin command
// TODO: make searchPin command

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

  console.log('[command incoming]:', command, args);

  // hooking commands
  ping    (command, args, message);
  getArgs (command, args, message);
  getDump (command, args, message);
  pin     (command, args, message);
  unpin   (command, args, message);
  search  (command, args, message);
};