/*
  Andromeda - queryWordsDB.js
  Acces a la base de donnees de mots requete
*/

const Database = require("./class/Database");
const QueryWord = require("./class/QueryWord");
const XMLFile = require("./class/XMLFile");

const databases = {
  queryWordsDB: new Database("QueryWords", word => new QueryWord(word.id, word.lemma, word.root, word.weight)),
  XMLFilesDB: new Database("Files", file => new XMLFile(file.id, "../"+file.url, file.name, file.genre)),

  updateAll: () => {
    for (db in databases) {
      if (databases[db] instanceof Database) {
        databases[db].updateAll();
      }
    }
  }
}

module.exports = databases;
