const texts = require("../texts");
const databases = require("../databases");
const addFrequencies = require("../utils");

const Section = require("./Section");


module.exports = class AlgoResult {
  constructor(fileID, queries, precision) {
    this.text = texts.getById(fileID);

    this.queries = databases.queryWordsDB.getByIds(queries);
    this.precision = precision;
    this.sectionedText = this.getSections();

    this.totalQueryFrequency = this.getTotalQueryFrequency();
    this.totalHits = this.getTotalHits();
    this.totalRatio = this.getTotalRatio();

    this.totalRelatedWords = this.getTotalRelatedWords();
  }

  getTotalQueryFrequency = () => {
    let frequencies = [];
    for (let section of this.sectionedText) {
      frequencies.push(section.queryFrequency);
    }
    return addFrequencies(frequencies);
  }

  getTotalRelatedWords = () => {
    let frequencies = [];
    for (let section of this.sectionedText) {
      frequencies.push(section.relatedWords);
    }
    return addFrequencies(frequencies);
  }

  getTotalRatio = () => {
    return this.totalHits / this.text.length;
  };

  getTotalHits = () => {
    let totalHits = 0;

    for (let query in this.totalQueryFrequency) {
      totalHits += this.totalQueryFrequency[query];
    }
    return totalHits;
  }

  getSections = () => {
    const sections = [];
    let lastLine = [];
    console.log(this.text);
    for (let division of this.text.content) {
      for (let line of division.text) {
        const id = sections.length + 1;
        if (lastLine.length < this.precision) {
          lastLine.push(line);
        } else {
          sections.push(new Section(lastLine, this.queries, id));
          lastLine = [line];
        }
      }
    }

    if (lastLine) {
      const id = sections.length + 1;
      sections.push(new Section(lastLine, this.queries, id));
    }

    return sections;
  };
};

