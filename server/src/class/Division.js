module.exports = class Division {
  constructor(name, text) {
    this.name = name;
    this.text = text;
  }
  getLength() {
    return this.text.split(" ").length;
  }
  cleanText() {
    //Fonction degueulasse
    const purgeChar = [",", ".", ";", ":", "—", "†"];
    let tempText = this.text/*.split("/n").join(" ")*/;
    for (let char of purgeChar) {
      tempText = tempText.split(char).join("");
    }
    return tempText;
  }
  makeFrequency() {
    const frequency = {};
    const cleanText = this.cleanText();

    for (let word of cleanText.split(" ")) {
      if (frequency[word]) {
        frequency[word]++;
      } else {
        frequency[word] = 1;
      }
    }
    return frequency;
  }
};
