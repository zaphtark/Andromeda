/*
  Andromeda - queryWordsDB.js
  Acces a la base de donnees de mots requete
*/

const sqlite3 = require("sqlite3");
const SQLUtil = require("./SQLUtil");
const QueryWord = require("./class/QueryWord");
const { makeInsertSQL, makeUpdateSQL } = require("./SQLUtil");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const queryWordsDB = {
  getAll: function (next) {
    db.all("SELECT * FROM QueryWords", (err, words) => {
      next(err, words);
    });
  },

  getById: function (id, next) {
    id = parseInt(id);

    for (let word of queryWordsDB.data) {
      if (word.id === id) {
        next(null, word);
        break;
      }
    }
  },

  add: function (word, next) {
    db.run(
      SQLUtil.makeInsertSQL("QueryWords", word),
      SQLUtil.makeValues(word),
      (err) => {
        if (err) {
          next(err);
        } else {
          queryWordsDB.updateAll(next, err);
        }
      }
    );
  },

  update: function (word, next) {
    console.log(SQLUtil.makeUpdateSQL("QueryWords", word));
    db.run(
      SQLUtil.makeUpdateSQL("QueryWords", word),
      SQLUtil.makeValues(word),
      (err) => {
        if (err) {
          next(err);
        } else {
          queryWordsDB.updateAll(next, err);
        }
      }
    );
  },

  delete: function (id, next) {
    db.run(`DELETE FROM QueryWords WHERE id = ${id}`, (err) => {
      queryWordsDB.updateAll(next, err);
    });
  },

  data: [],
  updateAll(next = null, err = null) {
    queryWordsDB.data = [];
    queryWordsDB.getAll((err, words) => {
      if (!err) {
        for (let word of words) {
          queryWordsDB.data.push(
            new QueryWord(word.id, word.lemma, word.root, word.weight)
          );
        }
      }
      if (next instanceof Function) {
        next(err, queryWordsDB.data);
      }
    });
  },
};

module.exports = queryWordsDB;
