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
                content = makeTheatreContent($, this.getLanguage());
                break;
            case "epic":
                content = makeEpicContent($, this.getLanguage());
                break;
            case "lyric":
                content = makeLyricContent($, this.getLanguage());
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


const makeTheatreContent = ($, language) => {
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
                                    lastSpeaker = greekify(lastSpeaker);
                                }

                                const id = content.length + 1;
                                content.push(new Division(id, lastSpeaker, lastLine));
                                lastLine = [];
                            }

                            lastSpeaker = child.children[0].data;
                            break;

                        case "l":
                            const divId = content.length + 1;
                            const text = language == "Greek" ? greekify(child.children[0].data) : child.children[0].data;

                            lastLine.push(new Line(lineCounter, text, divId));
                            lineCounter++;
                            break;
                    }
                }
            });
        });
    return content;
}

const makeLyricContent = ($, language) => {
    const content = [];
    let lastDivText = [];
    let lineCounter = 1;
    let divCounter = 1;

    $("body")//Pour chaque poeme
        .find("div2")
        .each((i, elem) => {
            //Pour chaque enfant de chaque livre
            const poemNumber = elem.attribs["n"];
            elem.children.forEach((child) => {
                //Pour chaque tag dans chaque enfant
                if (child.type === "tag" && child.children[0]) {
                    switch (child.name) {
                        case "lg":
                            child.children.forEach((grandChild) => {
                                console.log(grandChild);
                            });
                            break;

                        case "l":
                            child.children.forEach((grandChild) => {
                                if (grandChild.type == "text") {
                                    let text = grandChild.data;
                                    if (language == "Greek") {
                                        text = greekify(text);
                                    }
                                    lastDivText.push(new Line(lineCounter, text, divCounter));
                                    lineCounter++;
                                }

                            });
                            break;
                    }

                }
            });
            content.push(new Division(divCounter, "Poeme " + poemNumber, lastDivText));
            lastDivText = [];
            divCounter++;
        });
    return content;
}

//LE NONNOS DOIT ETRE RENOMME POUR QUE CA MARCHE
const makeEpicContent = ($, language) => {
    const content = [];
    let lastDivText = [];
    let lineCounter = 1;
    let divCounter = 1;

    $("body")//Pour chaque livre
        .find("div1")
        .each((i, elem) => {
            //Pour chaque enfant de chaque livre
            const bookNumber = elem.attribs["n"];
            elem.children.forEach((child) => {
                //Pour chaque tag dans chaque enfant
                if (child.children) {
                    child.children.forEach((grandChild) => {
                        if (grandChild.type == "text") {
                            let text = grandChild.data;
                            if (language == "Greek") {
                                text = greekify(text);
                            }
                            lastDivText.push(new Line(lineCounter, text, divCounter));
                            lineCounter++;
                        }

                    })
                }
            });
            content.push(new Division(divCounter, "Book " + bookNumber, lastDivText));
            lastDivText = [];
            divCounter++;
        });
    return content;
}