// file-based data API implementation
const fs                    = require('fs');
const pinsDatabasePath      = './data/database.json';
const remindersDatabasePath = './data/reminders.json';
const SEPARATOR             = '_';

// create database if file doesn't exist yet
if (!fs.existsSync(pinsDatabasePath)) {
  fs.writeFileSync(pinsDatabasePath, '{}');
}
if (!fs.existsSync(remindersDatabasePath)) {
  fs.writeFileSync(remindersDatabasePath, '{}');
}

// read database content
const remindersDatabaseContent = fs.readFileSync(remindersDatabasePath, 'utf8');
const remindersData            = JSON.parse(remindersDatabaseContent);
const pinsDatabaseContent      = fs.readFileSync(pinsDatabasePath, 'utf8');
const pinsData                 = JSON.parse(pinsDatabaseContent);

// write memory data to disk
const persist = () => {
  fs.writeFileSync(pinsDatabasePath,      JSON.stringify(pinsData));
  fs.writeFileSync(remindersDatabasePath, JSON.stringify(remindersData));
};

// build key to use in database
const buildKey = (user_id, message_url) => {
  return `${user_id}${SEPARATOR}${message_url}`;
}

module.exports = {

  pin: (user_id, message_url, keywords, common = true) => {
    try {
      if (common) {
        data[message_url] = keywords;
      } else {
        const key = buildKey(user_id, message_url);
        data[key] = keywords;
      }
      persist();
    } catch (e) {
      throw e;
    } finally {
      return true;
    }
  },

  unpin: (user_id, message_url, common = true) => {
    try {
      if (common) {
        delete data[message_url];
      } else {
        const key = buildKey(user_id, message_url);
        delete data[key];
      }
      persist();
    } catch (e) {
      throw e;
    } finally {
      return true;
    }
  },

  search: (server_id, user_id, keywords, common = true) => {
    const filteredPins = Object.entries(data).filter(e => e[1].includes(keywords));
    try {
      if (common) {
        // if common; only get entries WITHOUT user_id attached
        for (let i = 0; i < filteredPins.length; i++) {
          const pin = filteredPins[i];
          if (pin[0].includes(SEPARATOR)) {
            delete filteredPins[i];
          }
        }
      } else {
        // otherwise removing pins that aren't meant to that user
        for (let i = 0; i < filteredPins.length; i++) {
          const pin = filteredPins[i];
          if (!pin[0].includes(user_id)) {
            delete filteredPins[i];
          }
        }
      }
      // keep only entries including server_id
      for (let i = 0; i < filteredPins.length; i++) {
        const pin = filteredPins[i];
        if (!pin[0].includes(server_id)) {
          delete filteredPins[i];
        }
      }
    } catch (e) {
      throw e;
    } finally {
      return filteredPins;
    }
  },

  remind: (server_id, user_id, message_url, delay, keywords) => {
    // TODO: interpret delay
    // TODO: set timer and retain it
    // TODO: setup action that will get executed
    // TODO: how to actually send a message from here? (do we need observers/messaging?)
    console.log('CREATING REMINDER FOR:', server_id, user_id, message_url, delay, keywords);
  },

  forget: (server_id, user_id, message_url) => {
    // TODO: all of the below needs to be done in a secure manner
    //    (wait for one instruction to complete safely before executing then next)
    // TODO: find reminder in database
    // TODO: fetch related timer
    // TODO: destroy timer
    // TODO: delete reminder from database
    // TODO: return deleted line so we can display forgot reminder info

    console.log('FORGETTING REMINDER FOR:', server_id, user_id, message_url);

    // return keywords;
  }

};