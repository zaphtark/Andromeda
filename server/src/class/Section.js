const addFrequencies = require("../utils");

module.exports = class Section {
    constructor(text, queries, id) {
        this.id = id
        this.text = text
        this.length = this.getLength();
        this.frequency = this.getFrequency();
        this.queryFrequency = this.getQueryFrequency(queries);
        this.totalHits = this.getTotalHits();
        this.ratio = this.getRatio();
        this.length = this.getLength();
        this.relatedWords = this.getRelatedWords();
    }

    getLength = () => {
        let length = 0;
        for (let line of this.text) {
            length += line.length;
        }
        return length;
    }

    getFrequency = () => {
        let frequencies = [];
        for (let line of this.text) {
            frequencies.push(line.frequency);
        }
        return addFrequencies(frequencies);
    };

    getQueryFrequency = (queries) => {
        let frequencies = [];
        for (let line of this.text) {
            frequencies.push(line.getQueryFrequency(queries));
        }
        return addFrequencies(frequencies);
    };

    getRelatedWords = () => {
        let frequencies = [];
        for (let line of this.text) {
            if (line.targeted) {
                frequencies.push(line.frequency);
            }
        }
        return addFrequencies(frequencies);
    };

    getRatio = () => {
        return this.totalHits / this.length;
    };

    getTotalHits = () => {
        let totalHits = 0;

        for (let query in this.queryFrequency) {
            totalHits += this.queryFrequency[query];
        }

        return totalHits;
    }

}

