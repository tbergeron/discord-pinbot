// file-based data API implementation
const fs           = require('fs');
const databasePath = './database.json';

// create database if file doesn't exist yet
if (!fs.existsSync(databasePath)) {
  fs.writeFileSync(databasePath, '{}');
}

// read database content
const databaseContent = fs.readFileSync(databasePath, 'utf8');
const data            = JSON.parse(databaseContent);

// write memory data to disk
const persist = () => {
  fs.writeFileSync(databasePath, JSON.stringify(data));
};

const buildKey = (user_id, message_url) => {
  return `${user_id}_${message_url}`;
}

// TODO: things tend to be fucky when
// using multiple keywords separated by spaces

module.exports = {

  getDump: () => {
    return data;
  },

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

  search: (user_id, keywords, common = true) => {
    const filteredPins = Object.entries(data).filter(e => e[1].includes(keywords));

    if (common) {

      // TODO: if common; only get entries WITHOUT user_id attached

    } else {
      // otherwise removing pins that aren't meant to that user
      // TODO: find better way; seems sucky and unsafe imo
      for (let i = 0; i < filteredPins.length; i++) {
        const pin = filteredPins[i];
        if (!pin[0].includes(user_id)) {
          delete filteredPins[i];
        }
      }
    }

    return filteredPins;
  }

};