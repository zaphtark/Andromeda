//Récupère les éléments à remplir
const text = document.getElementById("text");
const results = document.getElementById("results");
const words = document.getElementById("words");
const form = document.getElementById("form");

//Variables globales qui contiennent le contenu actuel à afficher
let currentData = {};
let currentQuery = "";

//Quand le document est prêt, on crée le formulaire
docReady(createForm);

//Fonction qui ajoute les mots depuis la base de donnée dans le formulaire
function createForm() {
  //Va chercher les mots
  Api.getAllWords().then((data) => {
    for (let word of data.words) {
      document.getElementById("queries").appendChild(makeWord(word));
    }
    form.addEventListener("submit", submit);
  });
}

function showData() {
  clearData();
  showText();
  showWords();
  showResults();
}

function showText() {
  //Pour chaque titre
  currentData.data.text.content.forEach((division) => {
    //titleText = lookupQuery(currentQuery, titleText) || titleText;
    division.text =
      lookupQueries(currentData.data.queries, division.text) || division.text;

    text.appendChild(createElementFromText("h3", division.name));
    text.appendChild(createElementFromText("p", division.text));
  });
}

function showWords() {
  //Pour chaque mot
  for (let result in currentData.data.totalFrequency) {
    const text = result + " : " + currentData.data.totalFrequency[result];
    words.appendChild(createElementFromText("p", text));
  }
}

function showResults() {
  const text = "Ratio total : " + currentData.data.totalRatio;
  results.appendChild(createElementFromText("h4", text));

  for (let [index, divRatio] of currentData.data.ratioBySection.entries()) {
    results.appendChild(createDivSquare(divRatio, index));
  }
}

function clearData() {
  while (results.lastElementChild) {
    results.removeChild(results.lastElementChild);
  }

  while (words.lastElementChild) {
    words.removeChild(words.lastElementChild);
  }

  while (text.lastElementChild) {
    text.removeChild(text.lastElementChild);
  }
}

function lookupQueries(queries, text) {
  for (let query of queries) {
    query.regex = new RegExp(query.root, "gi");
    text = text.replace(query.regex, (match) => `<mark>${match}</mark>`);
  }
  text = text.split("/n").join("<br>");
  return text;
}

function submit(form) {
  const reqBody = {
    url: "../" + document.getElementById("url").value,
    queries: getCurrentQueries(),
    precision: 50, //Pour le moment
  };

  Api.getAlgoResult(reqBody).then((data) => {
    currentData = data;
    showData();
  });
}

function getCurrentQueries() {
  const results = [];
  const markedCheckbox = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  for (let checkbox of markedCheckbox) {
    results.push(checkbox.value);
  }
  return results;
}

function makeWord(word) {
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", word.id);
  input.setAttribute("name", word.lemma);
  input.setAttribute("value", word.id);

  const label = createElementFromText("label", word.lemma);
  label.setAttribute("for", word.lemma);

  const div = document.createElement("div");
  div.appendChild(input);
  div.appendChild(label);
  div.appendChild(document.createElement("br"));

  return div;
}

function createDivSquare(divRatio, pos) {
  const precision = parseInt(currentData.data.precision);
  const square = document.createElement("div");
  let color = 255 - divRatio * precision * 2 * 255;
  color = color >= 0 ? color : 0;
  square.setAttribute(
    "style",
    "background-color: rgb(" + color + "," + color + "," + color + ")"
  );
  square.setAttribute("class", "square");

  const lineRange = pos * precision + " - " + (pos * precision + precision);
  const tooltip = createElementFromText("span", lineRange + ": " + divRatio);
  tooltip.setAttribute("class", "tooltiptext");

  square.appendChild(tooltip);
  return square;
}
