const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const databases = require("./src/databases");
const AlgoResult = require("./src/class/AlgoResult");

const wordRouter = require("./src/wordRouter");
const fileRouter = require("./src/fileRouter");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.use("/words",wordRouter);
app.use("/files",fileRouter);

//POST pour avoir le resultat d'algorithme pour un texte particulier
app.post("/getText", (req, res) => {
  const fileID = req.body.fileID;
  const queries = req.body.queries;
  const precision = req.body.precision;

  if (!fileID) {
    return res.sendStatus(400);
  }

  const data = new AlgoResult(fileID, queries, precision);

  res.json({ data });
  res.end();
});

//Départ de l'application
app.listen(port, () => {
  //Charge la base de donnée
  databases.updateAll();
  console.log("App listening on port " + port);
});
