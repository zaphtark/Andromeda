const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const queryWordsDB = require("./src/queryWordsDB");
const AlgoResult = require("./src/class/AlgoResult");

const wordRouter = require("./src/wordRouter");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.use("/words",wordRouter);

//POST pour avoir le resultat d'algorithme pour un texte particulier
app.post("/getText", (req, res) => {
  const url = req.body.url;
  const queries = req.body.queries;
  const precision = req.body.precision;

  if (!url) {
    return res.sendStatus(400);
  }

  const data = new AlgoResult(url, queries, precision);

  console.log(data);
  res.json({ data });
  res.end();
});

//Départ de l'application
app.listen(port, () => {
  //Charge la base de donnée
  queryWordsDB.updateAll();
  console.log("App listening on port " + port);
});
