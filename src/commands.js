const config = require('../config.json');
const prefix = (config.PREFIX) ? config.PREFIX : '!';

// requiring API
const api = require('./api');

// reply with integrated debug output to console
const reply = (m, c) => {
  const server_id   = m.guild.id;
  const user_id     = m.author.id;
  console.log('server_id:', server_id, 'user_id:', user_id, '[replying]:', c);
  m.react('👌');
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
    stringifiedPins   += `\n${url}\n`;
  });
  return stringifiedPins;
}

// command controllers
const help = (c, a, m) => {
  if (c === 'help') {
    let helpMessage = "here are my current commands:\n```";
    helpMessage += "!uptime\n";
    helpMessage += "\nCommon Pins (shared between all users)\n\n";
    helpMessage += "!pin            <message_url> <keywords>\n";
    helpMessage += "!unpin          <message_url>\n";
    helpMessage += "!searchpins     <keywords>\n";
    helpMessage += "\nPer-User Pins (only accessible by you)\n\n";
    helpMessage += "!userpin        <message_url> <keywords>\n";
    helpMessage += "!userunpin      <message_url>\n";
    helpMessage += "!usersearchpins <keywords>\n";
    helpMessage += "\nMessage Reminders\n\n";
    helpMessage += "!remindme      <message_url> <delay> <reminder message>\n";
    helpMessage += "!forget        <message_url>\n```";
    reply(m, helpMessage);
  }
};

const uptime = (c, a, m) => {
  if (c === 'uptime') {
    let totalSeconds = (m.client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`;

    return reply(m, `i have been up for ${uptime}`);
  }
};

const pin = (c, a , m) => {
  if (c === 'pin') {
    if ((a[0] !== undefined) && (a[1] !== undefined)) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const message_url = a[0];
      const keywords    = a.slice(1, a.length).join(' ');

      api.pin(server_id, user_id, message_url, keywords);

      return reply(m, `pinned message: **${message_url}** (keywords: **${keywords}**)`);
    } else {
      return reply(m, `${prefix}pin syntax: <message_url> <keywords>`);
    }
  }
};

const userPin = (c, a , m) => {
  if (c === 'userpin') {
    if ((a[0] !== undefined) && (a[1] !== undefined)) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const message_url = a[0];
      const keywords    = a.slice(1, a.length).join(' ');

      api.pin(server_id, user_id, message_url, keywords, false);

      return reply(m, `pinned message: **${message_url}** for **${m.author.username}** (keywords: **${keywords}**)`);
    } else {
      return reply(m, `${prefix}userPin syntax: <message_url> <keywords>`);
    }
  }
};

const unpin = (c, a, m) => {
  if (c === 'unpin') {
    if (a[0] !== undefined) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const message_url = a[0];

      api.unpin(server_id, user_id, message_url);

      return reply(m, `unpinned message: **${message_url}**`);
    } else {
      return reply(m, `${prefix}unpin syntax: <message_url>`);
    }
  }
};

const userUnpin = (c, a, m) => {
  if (c === 'userunpin') {
    if (a[0] !== undefined) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const message_url = a[0];

      api.unpin(server_id, user_id, message_url, false);

      return reply(m, `unpinned message: **${message_url}** for **${m.author.username}**`);
    } else {
      return reply(m, `${prefix}userUnpin syntax: <message_url>`);
    }
  }
};

const searchPins = (c, a, m) => {
  if (c === 'searchpins') {
    if (a[0] !== undefined) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const keywords    = a.join(' ');

      // fetching common pins based on keywords
      const pins = api.search(server_id, user_id, keywords);

      return reply(m, `searching in pins for **${keywords}**: ${stringifyPins(pins)}`);
    } else {
      return reply(m, `${prefix}searchPins syntax: <keywords>`);
    }
  }
};

const userSearchPins = (c, a, m) => {
  if (c === 'usersearchpins') {
    if (a[0] !== undefined) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const keywords    = a[0];

      // fetching per-user pins based on keywords
      const pins = api.search(server_id, user_id, keywords, false);

      return reply(m, `searching in **${m.author.username}**'s pins for **${keywords}**: ${stringifyPins(pins)}`);
    } else {
      return reply(m, `${prefix}userSearchPins syntax: <keywords>`);
    }
  }
};

const remindme = (c, a, m) => {
  if (c === 'remindme') {
    if (a[0] !== undefined) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const message_url = a[0];
      const delay       = a[1];
      const keywords    = a.slice(2, a.length).join(' ');

      api.remind(server_id, user_id, message_url, delay, keywords);

      return reply(m, `created reminder for: **${message_url}** in **${delay}** (**${keywords}**)`);
    } else {
      return reply(m, `${prefix}remind syntax: <message_url> <delay> <reminder message>`);
    }
  }
};

const forget = (c, a, m) => {
  if (c === 'forget') {
    if (a[0] !== undefined) {
      const server_id   = m.guild.id;
      const user_id     = m.author.id;
      const message_url = a[0];

      const keywords = api.forget(server_id, user_id, message_url);

      return reply(m, `forgot reminder for: **${message_url}** (**${keywords}**)`);
    } else {
      return reply(m, `${prefix}forget syntax: <message_url>`);
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
  pin            (command, args, message);
  unpin          (command, args, message);
  userPin        (command, args, message);
  userUnpin      (command, args, message);
  searchPins     (command, args, message);
  userSearchPins (command, args, message);
  remindme       (command, args, message);
  forget         (command, args, message);
};