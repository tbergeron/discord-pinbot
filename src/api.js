// file-based data API implementation
const data = {

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
    return true;
  },

  // write memory data to disk
  persist: () => {
    // TODO: write data to disk
  }

};