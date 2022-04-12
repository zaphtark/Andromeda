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

module.exports = addFrequencies;