// file-based data API implementation
const fs = require('fs');
const databasePath = './database.json';

// create database if file doesn't exist yet
if (!fs.existsSync(databasePath)) {
  fs.writeFileSync(databasePath, '{}');
}

// read database content
const databaseContent = fs.readFileSync(databasePath, 'utf8');
const data = JSON.parse(databaseContent);

// write memory data to disk
const persist = () => {
  fs.writeFileSync(databasePath, JSON.stringify(data));
};

module.exports = {

  // return all data from memory
  getDump: () => {
    return data;
  },

  // load data from memory
  getData: (key) => {
    // check if key exists in object
    if (data[key] !== undefined) {
      return data[key];
    }
  },

  // save data to memory
  saveData: (key, value) => {
    data[key] = value;
    persist();
    return true;
  }

};