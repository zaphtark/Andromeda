const addFrequencies = require("../utils");

module.exports = class Text {
  constructor(XMLFile) {
    this.id = XMLFile.id;
    this.author = XMLFile.getAuthor();
    this.title = XMLFile.getTitle();
    this.edition = XMLFile.getEdition();
    this.language = XMLFile.getLanguage();
    this.content = XMLFile.getContent();
    this.frequency = this.getFrequency();
    this.length = this.getLength();
  }

  getLength() {
    let length = 0;
    for (let division of this.content) {
      length += division.getLength();
    }
    return length;
  }

  getFrequency() {
    const frequencies = [];

    for (let division of this.content) {
      frequencies.push(division.frequency);
    }

    return addFrequencies(frequencies);
  }
};


