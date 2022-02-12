const greekify = require("../greekify");
const Division = require("./Division");

module.exports = class Text {
  constructor(author, title, edition, language, $) {
    this.author = author;
    this.title = title;
    this.edition = edition;
    this.language = language;
    this.content = this.makeContent($);
    this.frequency = this.getWordFrequency();
  }

  makeContent($) {
    const content = [];

    let lastSpeaker = "";
    let lastLine = [];
    $("body")
      .find("sp")
      .each((i, elem) => {
        elem.children.forEach((child) => {
          if (child.type === "tag" && child.children[0]) {
            switch (child.name) {
              case "speaker":
                if (lastLine && lastSpeaker) {
                  

                  //Changer le betacode pour du grec au besoin
                  if (this.language == "Greek") {
                    for(let [i, line] of lastLine.entries()){
                      lastLine[i] = greekify(line);
                    }
                    lastSpeaker = greekify(lastSpeaker);
                  }

                  lastLine = lastLine.join("/n");
                  content.push(new Division(lastSpeaker, lastLine));
                  lastLine = [];
                }
                lastSpeaker = child.children[0].data;
                break;

              case "l":
                lastLine.push(child.children[0].data);
                break;
            }
          }
        });
      });
    return content;
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
      for (let word of cleanText.split(" ")) {
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


