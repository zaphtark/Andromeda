const addFrequencies = require("../utils");

module.exports = class Division {
  constructor(id, name, text) {
    this.id = id;
    this.name = name;
    this.text = text; //Array of Line objects
    this.length = this.getLength();
    this.frequency = this.getFrequency();
  }

  getLength() {
    let length = 0;
    for (let line of this.text) {
      length += line.length;
    }
    return length
  }

  getFrequency() {
    const frequencies = [];

    for (let line of this.text) {
      frequencies.push(line.frequency);
    }

    return addFrequencies(frequencies);
  }
};
