const queryWordsDB = require("../queryWordsDB");
const scraper = require("../xmlScraper");
const Division = require("./Division");

module.exports = class AlgoResult {
  constructor(url, queries, precision) {
    this.text = scraper.getTextData(url);
    this.queries = makeQueries(queries);
    this.precision = precision;
    this.totalFrequency = makeTotalFrequency(this.text, this.queries);
    this.totalRatio = makeTotalRatio(this.text, this.totalFrequency);

    this.sectionedText = makeSections(this.text, this.precision);
    this.frequencyBySection = makeFrequencyBySections(
      this.sectionedText,
      this.queries
    );
    this.ratioBySection = makeRatioBySections(
      this.sectionedText,
      this.frequencyBySection
    );
  }
};

//Prend un array de ID pour aller chercher les mots
const makeQueries = (queries) => {
  const results = [];
  for (let query of queries) {
    query = parseInt(query);
    queryWordsDB.getById(query, (err, word) => {
      results.push(word);
    });
  }
  return results;
};

const makeTotalFrequency = (text, queries) => {
  const results = {};

  for (let query of queries) {
    results[query.lemma] = 0;

    for (let word in text.frequency) {
      if (query.regex.test(word)) {
        results[query.lemma] += text.frequency[word];
      }
    }
  }

  return results;
};

const makeTotalRatio = (text, targetFrequency) => {
  const textLength = text.getLength();
  let totalHits = 0;

  for (let query in targetFrequency) {
    totalHits += targetFrequency[query];
  }

  return totalHits / textLength;
};

const makeFrequencyBySections = (text, queries) => {
  const results = [];

  for (let section of text) {
    const frequencies = makeSectionFrequency(section);
    const sectionResult = makeSectionResults(queries, frequencies);
    results.push(sectionResult);
  }

  return results;
};

const addFrequencies = (frequencies) => {
  const result = {};

  for (let frequency of frequencies) {
    for (let word in frequency) {
      if (result[word]) {
        result[word] += frequency[word];
      } else {
        result[word] = frequency[word];
      }
    }
  }

  return result;
};

const makeSectionFrequency = (section) => {
  let frequencies = [];

  for (let part of section) {
    frequencies.push(makeStringFrequency(part));
  }
  frequencies = addFrequencies(frequencies);

  return frequencies;
};

const makeSections = (text, precision) => {
  const sections = [[]];
  for (let sectionision of text.content) {
    sectionision = sectionision.text.split("/n");
    for (let line of sectionision) {
      const lastSection = sections[sections.length - 1];
      if (lastSection.length < precision) {
        sections[sections.length - 1].push(line);
      } else {
        sections.push([line]);
      }
    }
  }

  //Pour utiliser les sectionisions
  //rest = text.content(?)
  /*while (rest.length > precision) {
    sections.push(rest.slice(0, precision));
    rest = rest.slice(precision);
  }
  sections.push(rest[0]);*/

  return sections;
};

const makeSectionResults = (queries, frequencies) => {
  const sectionResult = {};

  for (let query of queries) {
    sectionResult[query.lemma] = 0;

    for (let word in frequencies) {
      if (query.regex.test(word)) {
        sectionResult[query.lemma] += frequencies[word];
      }
    }
  }

  return sectionResult;
};

const makeRatioBySections = (text, frequencyBySection) => {
  const ratios = [];
  for (let i = 0; i < text.length; i++) {
    const sectionRatio = makeSectionRatio(text[i], frequencyBySection[i]);
    ratios.push(sectionRatio);
  }
  return ratios;
};

const makeSectionRatio = (section, targetFrequency) => {
  const textLength = getSectionLength(section);
  let totalHits = 0;

  for (let query in targetFrequency) {
    totalHits += targetFrequency[query];
  }

  return totalHits / textLength;
};

const getSectionLength = (section) => {
  let length = 0;

  for (let line of section) {
    length += cleanString(line).split(" ").length;
  }

  return length;
};

const makeStringFrequency = (str) => {
  str = cleanString(str);
  const frequency = {};

  for (let word of str.split(" ")) {
    if (frequency[word]) {
      frequency[word]++;
    } else {
      frequency[word] = 1;
    }
  }
  return frequency;
};

const cleanString = (str) => {
  //Fonction degueulasse
  const purgeChar = [",", ".", ";", ":", "—", "†"];
  let tempText = str;
  for (let char of purgeChar) {
    tempText = tempText.split(char).join("");
  }
  return tempText;
};
