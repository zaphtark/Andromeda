module.exports = class Text {
  constructor(XMLFile) {
    this.author = XMLFile.getAuthor();
    this.title = XMLFile.getTitle();
    this.edition = XMLFile.getEdition();
    this.language = XMLFile.getLanguage();
    this.content = XMLFile.getContent();
    this.frequency = this.getWordFrequency();
    this.length = this.getLength();
  }

  getLength() {
    let length = 0;
    for (let division of this.content) {
      length += division.getLength();
    }
    return length;
  }

  getWordFrequency() {
    const frequency = {};
    for (let division of this.content) {
      const cleanText = division.cleanText();
      for (let line of cleanText) {
        if (line) {
          for (let word of line.split(" ")) {
            if (frequency[word]) {
              frequency[word]++;
            } else {
              frequency[word] = 1;
            }
          }
        }

      }

    }

    return frequency;
  }
};


