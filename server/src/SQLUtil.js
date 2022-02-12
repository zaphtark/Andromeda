/*
  Andromeda - SQLUtil.js
  Fonctions utilitaires pour faciliter l'accès à la base de données
*/

const SQLUtil = {
    makeValues: function (object) {
      const values = {};
      for (const key in object) {
        values["$" + key] = object[key];
      }
      return values;
    },
    //The values have to have the same name as the database columns
    makeInsertSQL: function (table, object) {
      const rows = [];
      const values = [];
      //For every key in the object, put key in row and $key in values
      for (const key in object) {
        rows.push(key);
        values.push("$" + key);
      }
      return (
        "INSERT INTO " +
        table +
        " (" +
        rows.join(", ") +
        ") VALUES (" +
        values.join(",") +
        ")"
      );
    },
    makeUpdateSQL: function (table, object) {
      const rows = [];
      for (const key in object) {
        if (key !== "id") {
          rows.push(key + " = $" + key);
        }
      }
      return "UPDATE " + table + " SET " + rows.join(", ") + " WHERE id = $id";
    },
  };
  
  module.exports = SQLUtil;
  