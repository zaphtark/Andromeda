const res = require("express/lib/response");
const addFrequencies = require("../utils");

module.exports = class Line {
    constructor(id, text, divId) {
        this.id = id;
        this.text = text || "";
        this.divId = divId;
        this.length = this.getLength();
        this.cleanText = this.getCleanText();
        this.frequency = this.cleanText ? this.getFrequency() : null;
    }

    getLength() {
        return this.text.split(" ").length || 0;
    }

    getCleanText() {
        let cleanText = this.text;
        const purgeChar = [",", ".", ";", ":", "—", "†"];

        for (let char of purgeChar) {
            cleanText = cleanText ? cleanText.split(char).join("") : null;
        }

        return cleanText;
    }

    getFrequency() {
        const frequency = {};
        for (let word of this.cleanText.split(" ")) {
            frequency[word] = ~~frequency[word] + 1; 
        }
        return frequency;
    }

    getQueryFrequency(queries) {
        const result = {};
        for (let query of queries) {
            result[query.lemma] = 0;

            for (let word in this.frequency) {
                if (query.regex.test(word)) {
                    this.targeted = true;
                    result[query.lemma] += this.frequency[word];
                }
            }
        }

        this.queryFrequency = result;
        return result;
    }
}
