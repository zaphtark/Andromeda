const express = require("express");
const queryWordsDB = require("./databases").queryWordsDB;

const wordRouter = express.Router();

//Determine req.word selon l'ID demandé
wordRouter.param("wordId", (req, res, next, wordId) => {
  queryWordsDB.getById(wordId, (err, word) => {
    if (err) {
      next(err);
    } else if (word) {
      req.word = word;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Get tous les mots requete
wordRouter.get("/", (req, res, next) => {
  res.status(200).json({ words: queryWordsDB.data });
});

//Get un mot requete selon son id
wordRouter.get("/:wordId", (req, res, next) => {
  res.status(200).json({ word: req.word });
});
/*
//POST un nouveau mot
wordRouter.post("/", (req, res, next) => {
  const newWord = req.body;

  //S'il manque un paramètre, erreur 400
  if (!newWord.lemma || !newWord.root || !newWord.weight) {
    return res.sendStatus(400);
  }

  queryWordsDB.add(newWord, (err, words) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ words: words });
    }
  });
});

//PUT mettre a jour mot avec ID
wordRouter.put("/:wordId", (req, res, next) => {
  const newWord = req.body;

  //S'il manque un paramètre, erreur 400
  if (!newWord.id || !newWord.lemma || !newWord.root || !newWord.weight) {
    return res.sendStatus(400);
  }

  queryWordsDB.update(newWord, (err, words) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ words: words });
    }
  });
});

//DELETE mot avec ID
wordRouter.delete("/:wordId", (req, res, next) => {
  queryWordsDB.delete(req.params.wordId, (err, words) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ words: words });
    }
  });
});
*/
module.exports = wordRouter;
