module.exports = class Section {
    constructor(text, queries, id) {
        this.id = id
        this.text = text
        this.length = this.getLength();
        this.frequency = this.getFrequency();
        this.queryFrequency = this.getQueryFrequency(queries);
        this.ratio = this.getRatio();
        this.length = this.getLength();
    }

    cleanString = (str) => {
        //Fonction degueulasse
        const purgeChar = [",", ".", ";", ":", "—", "†"];
        let tempText = str;
        for (let char of purgeChar) {
            if (tempText) {
                tempText = tempText.split(char).join("");
            }
        }
        return tempText;
    };

    getStringFrequency = (str) => {
        str = this.cleanString(str);
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

    addFrequencies = (frequencies) => {
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

    getLength = () => {
        let length = 0;

        for (let line of this.text) {
            length += this.cleanString(line.text).split(" ").length;
        }

        return length;
    }

    getFrequency = () => {
        let frequencies = [];

        for (let part of this.text) {
            frequencies.push(this.getStringFrequency(part.text));
        }
        frequencies = this.addFrequencies(frequencies);

        return frequencies;
    };

    getQueryFrequency = (queries) => {
        const result = {};

        for (let query of queries) {
            result[query.lemma] = 0;

            for (let word in this.frequency) {
                if (query.regex.test(word)) {
                    result[query.lemma] += this.frequency[word];
                }
            }
        }

        return result;
    };

    getRatio = () => {
        let totalHits = 0;

        for (let query in this.queryFrequency) {
            totalHits += this.queryFrequency[query];
        }

        return totalHits / this.length;
    };
}

