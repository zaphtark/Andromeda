const fs = require("fs");
const cheerio = require("cheerio");

const Division = require("./Division");

const greekify = require("../greekify");
const Line = require("./Line");

module.exports = class XMLFile {
    constructor(id, url, name, genre) {
        this.id = id;
        this.url = url;
        this.xml = fs.readFileSync(url, { encoding: "utf-8" });
        this.$ = cheerio.load(this.xml, { xmlMode: true });
        this.name = name;
        this.genre = genre;
    }

    getContent = () => {
        const $ = this.$;

        //Enlève les tags inutiles
        $("body").find("note").remove("note");
        $("body").find("pb").remove("pb");

        let content = [];

        switch (this.genre) {
            case "theatre":
                //Fonction qui se trouve actuellemment dans Text.js
                content = makeTheatreContent($, this.getLanguage());
                break;
        }

        return content;
    }

    getEdition = () => {
        const $ = this.$;
        return {
            editor: $("sourceDesc").find("editor").text().trim(),
            title: $("sourceDesc").find("author").text().trim(),
            year: $("sourceDesc").find("date").text().trim(),
        };
    }

    getAuthor = () => {
        const $ = this.$;
        return $("titleStmt").find("author").text().trim();
    }


    getTitle = () => {
        const $ = this.$;
        return $("titleStmt").find("title").first().text().trim();
    }

    getLanguage = () => {
        const url = this.url.split("_");
        let langAb = url[url.length - 1];
        langAb = langAb.split(".")[0];
        switch (langAb) {
            case "gk":
                return "Greek";
                break;
            case "lat":
                return "Latin";
                break;
            case "eng":
                return "English";
                break;
        }
    }
}


makeTheatreContent = ($, language) => {
    const content = [];
    let lastSpeaker = "";
    let lastLine = [];
    let lineCounter = 1;

    $("body")
        .find("sp")
        .each((i, elem) => {
            elem.children.forEach((child) => {
                if (child.type === "tag" && child.children[0]) {
                    switch (child.name) {
                        case "speaker":
                            if (lastLine && lastSpeaker) {

                                //Changer le betacode pour du grec au besoin
                                if (language == "Greek") {
                                    for (let line of lastLine) {
                                        line.text = greekify(line.text);
                                    }
                                    lastSpeaker = greekify(lastSpeaker);
                                }

                                const id = content.length+1;
                                content.push(new Division(id, lastSpeaker, lastLine));
                                lastLine = [];
                            }

                            lastSpeaker = child.children[0].data;
                            break;

                        case "l":
                            const divId = content.length +1;
                            const text = child.children[0].data;
                            lastLine.push(new Line(lineCounter,text,divId));
                            lineCounter++;
                            break;
                    }
                }
            });
        });
    return content;
}