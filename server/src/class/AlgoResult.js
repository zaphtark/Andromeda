const databases = require("../databases");
const Section = require("./Section");
const Text = require("./Text");

module.exports = class AlgoResult {
  constructor(fileID, queries, precision) {
    const XMLFile = databases.XMLFilesDB.getById(fileID);
    this.text = new Text(XMLFile);

    this.queries = databases.queryWordsDB.getByIds(queries);
    this.precision = precision;

    this.totalQueryFrequency = this.getTotalQueryFrequency();
    this.totalRatio = this.getTotalRatio();

    this.sectionedText = this.getSections();
  }

  getTotalQueryFrequency = () => {
    const results = {};

    for (let query of this.queries) {
      results[query.lemma] = 0;

      for (let word in this.text.frequency) {
        if (query.regex.test(word)) {
          results[query.lemma] += this.text.frequency[word];
        }
      }
    }

    return results;
  }

  getTotalRatio = () => {
    const textLength = this.text.getLength();
    let totalHits = 0;

    for (let query in this.totalQueryFrequency) {
      totalHits += this.totalQueryFrequency[query];
    }

    return totalHits / textLength;
  };

  getSections = () => {
    const sections = [];
    let lastLine = [];
    for (let sectionText of this.text.content) {
      for (let line of sectionText.text) {
        if (lastLine.length < this.precision) {
          lastLine.push(line);
        } else {
          const id = sections.length + 1;
          sections.push(new Section(lastLine, this.queries, id));
          lastLine = [];
        }
      }
    }
    return sections;
  };
};

