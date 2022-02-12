/*
  Andromeda - xmlScraper.js
  Lit le fichier XML et retourne un Texte
*/

const fs = require("fs");
const cheerio = require("cheerio");
const Text = require("./class/Text");

function getTextData(xmlUrl) {
  //Ouvre le fichier XML avec Cheerio
  const xml = fs.readFileSync(xmlUrl, { encoding: "utf-8" });
  const $ = cheerio.load(xml, { xmlMode: true });

  //Enlève les tags inutiles
  $("body").find("note").remove("note");
  $("body").find("pb").remove("pb");

  //Trouve les informations sur l'édition, l'auteur et le titre
  const edition = {
    editor: $("sourceDesc").find("editor").text().trim(),
    title: $("sourceDesc").find("author").text().trim(),
    year: $("sourceDesc").find("date").text().trim(),
  };

  const author = $("titleStmt").find("author").text().trim();
  const title = $("titleStmt").find("title").first().text().trim();

  //Créée le texte
  const currentText = new Text(author, title, edition, getLanguage(xmlUrl), $);
  console.log(currentText.getLength());
  return currentText;
}

//La langue = la dernière partie de l'URL.
function getLanguage(xmlUrl) {
  const url = xmlUrl.split("_");
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

module.exports = { getTextData };
