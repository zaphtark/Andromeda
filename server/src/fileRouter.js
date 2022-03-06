const express = require("express");
const XMLFilesDB = require("./databases").XMLFilesDB;

const fileRouter = express.Router();

//Determine req.file selon l'ID demandé
fileRouter.param("fileId", (req, res, next, fileId) => {
  XMLFilesDB.getById(fileId, (err, file) => {
    if (err) {
      next(err);
    } else if (file) {
      req.file = file;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Get tous les mots requete
fileRouter.get("/", (req, res, next) => {
  res.status(200).json({ files: XMLFilesDB.data });
});

//Get un mot requete selon son id
fileRouter.get("/:fileId", (req, res, next) => {
  res.status(200).json({ file: req.file });
});
/*
//POST un nouveau mot
fileRouter.post("/", (req, res, next) => {
  const newFile = req.body;

  //S'il manque un paramètre, erreur 400
  if (!newFile.url || !newFile.name || !newFile.genre) {
    return res.sendStatus(400);
  }

  XMLFilesDB.add(newFile, (err, files) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ files: files });
    }
  });
});

//PUT mettre a jour mot avec ID
fileRouter.put("/:fileId", (req, res, next) => {
  const newFile = req.body;

  //S'il manque un paramètre, erreur 400
  if (!newFile.url || !newFile.name || !newFile.genre || !newFile.id) {
    return res.sendStatus(400);
  }

  XMLFilesDB.update(newFile, (err, files) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ files: files });
    }
  });
});

//DELETE mot avec ID
fileRouter.delete("/:fileId", (req, res, next) => {
  XMLFilesDB.delete(req.params.fileId, (err, files) => {
    if (err) {
      next(err);
    } else {
      res.status(201).json({ files: files });
    }
  });
});
*/
module.exports = fileRouter;
