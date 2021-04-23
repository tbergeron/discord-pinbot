const config = require('../config.json');
const prefix = (config.PREFIX) ? config.PREFIX : '!';

// requiring API
const api = require('./api');

// reply with integrated output to console
const reply = (m, c) => {
  console.log('[replying]:', c);
  m.reply(c);
};

// convert pins result to string
// TODO: make that whole shitty method better
const stringifyPins = (pins) => {
  let stringifiedPins = '';
  pins.forEach((pin) => {
    // strip user id
    const splitString  = pin[0].split('_');
    // making sure we have an URL
    let url = 'no_url_found';
    if (splitString[0] !== undefined) {
      if (splitString[0].includes('http')) {
        url = splitString[0];
      }
    }
    if (splitString[1] !== undefined) {
      if (splitString[1].includes('http')) {
        url = splitString[1];
      }
    }
    stringifiedPins   += `${url} -- `;
  });
  return stringifiedPins;
}

// commands
const help = (c, a, m) => {
  if (c === 'help') {
    let helpMessage = "here are my current commands:\n```";
    helpMessage += "!uptime\n\n";
    helpMessage += "Common Pins (shared between all users)\n\n";
    helpMessage += "!pin            <message_url> <keywords>\n";
    helpMessage += "!unpin          <message_url>\n";
    helpMessage += "!searchpins     <keywords>\n\n";
    helpMessage += "Per-User Pins (only accessible by you)\n\n";
    helpMessage += "!userpin        <message_url> <keyword>\n";
    helpMessage += "!userunpin      <message_url>\n";
    helpMessage += "!usersearchpins <keywords>\n```";

    helpMessage += "**common pins are working but per-user pins are borked atm**\n";

    reply(m, helpMessage);
  }
};

const uptime = (c, a, m) => {
  if (c === 'uptime') {
    // TODO rewrite this very sucky code
    let totalSeconds = (m.client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`;

    reply(m, `bot has been online for ${uptime}`);
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
      const keywords    = a.slice(1, a.length).join(' ');

      api.pin(user_id, message_url, keywords);

      reply(m, `pinned message: **${message_url}** Keywords: **${keywords}**`);
    } else {
      reply(m, `${prefix}pin syntax: <message_url> <keywords>`);
    }
  }
};

const userPin = (c, a , m) => {
  if (c === 'userpin') {
    if ((a[0] !== undefined) && (a[1] !== undefined)) {
      const user_id     = m.author.id;
      const message_url = a[0];
      const keywords    = a.slice(1, a.length).join(' ');

      api.pin(user_id, message_url, keywords, false);

      reply(m, `pinned message: **${message_url}** for UserId: **${user_id}** Keywords: **${keywords}**`);
    } else {
      reply(m, `${prefix}userPin syntax: <message_url> <keywords>`);
    }
  }
};

const unpin = (c, a, m) => {
  if (c === 'unpin') {
    if (a[0] !== undefined) {
      const user_id     = m.author.id;
      const message_url = a[0];

      api.unpin(user_id, message_url);

      reply(m, `unpinned message: **${message_url}**`);
    } else {
      reply(m, `${prefix}unpin syntax: <message_url>`);
    }
  }
};

const userUnpin = (c, a, m) => {
  if (c === 'userunpin') {
    if (a[0] !== undefined) {
      const user_id     = m.author.id;
      const message_url = a[0];

      api.unpin(user_id, message_url, false);

      reply(m, `unpinned message: **${message_url}** for UserId: **${user_id}**`);
    } else {
      reply(m, `${prefix}userUnpin syntax: <message_url>`);
    }
  }
};

const searchPins = (c, a, m) => {
  if (c === 'searchpins') {
    if (a[0] !== undefined) {
      const user_id     = m.author.id;
      const keywords    = a.join(' ');

      // fetching common pins based on keywords
      const pins = api.search(user_id, keywords);

      console.log('searchPins', pins);

      reply(m, `searching in pins for **${keywords}** Result: ${stringifyPins(pins)}`);
    } else {
      reply(m, `${prefix}searchPins syntax: <keywords>`);
    }
  }
};

const userSearchPins = (c, a, m) => {
  if (c === 'usersearchpins') {
    if (a[0] !== undefined) {
      const user_id     = m.author.id;
      const keywords    = a[0];

      // fetching per-user pins based on keywords
      const pins = api.search(user_id, keywords, false);

      console.log('userSearchPins', pins);

      reply(m, `searching in pins for **${keywords}** for UserId: **${user_id}**. Result: ${stringifyPins(pins)}`);
    } else {
      reply(m, `${prefix}userSearchPins syntax: <keywords>`);
    }
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

  console.log('[command incoming]:', command, args);

  // hooking commands
  help           (command, args, message);
  uptime         (command, args, message);
  getArgs        (command, args, message);
  getDump        (command, args, message);
  pin            (command, args, message);
  unpin          (command, args, message);
  userPin        (command, args, message);
  userUnpin      (command, args, message);
  searchPins     (command, args, message);
  userSearchPins (command, args, message);
};