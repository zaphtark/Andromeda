module.exports = class Division {
  constructor(id, name, text) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.length = this.getLength();
  }
  getLength() {
    let length = 0;
    for(let line of this.text){
      length+=line.getLength();
    }
    return length
  }
  cleanText() {
    const cleanText = [];
    //Fonction degueulasse
    const purgeChar = [",", ".", ";", ":", "—", "†"];
    for (let line of this.text) {
      console.log(line.text);
      let text = line.text;
      for (let char of purgeChar) {
        text = text ? text.split(char).join("") : null;
      }
      cleanText.push(text);
    }

    return cleanText;
  }
  makeFrequency() {
    const frequency = {};
    const cleanText = this.cleanText();

    for (let line of cleanText) {
      for (let word of line.text.split(" ")) {
        if (frequency[word]) {
          frequency[word]++;
        } else {
          frequency[word] = 1;
        }
      }
    }
    return frequency;
  }
};
