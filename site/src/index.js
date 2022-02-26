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
async function createForm() {
  const data = {
    words: await Api.getAllWords(),
    files: await Api.getAllFiles()
  }

  for (let word of data.words.words) {
    document.getElementById("queries").appendChild(makeWord(word));
  }

  for (let file of data.files.files) {
    document.getElementById("textPicker").appendChild(makeFile(file));
  }

  form.addEventListener("submit", submit);
}

function showData() {
  updateText();
  updateWords();
  updateResults();
}

function updateText() {
  while (text.lastElementChild) {
    text.removeChild(text.lastElementChild);
  }
  //Pour chaque Division
  for (let division of currentData.data.text.content) {
    text.appendChild(createElementFromText("h3", division.name));

    for (let line of division.text) {
      const lineText = lookupQueries(currentData.data.queries, line.text, findLineSectionID(line)) || line.text;
      text.appendChild(createElementFromText("p", lineText));
    }
  }
}

function updateWords() {
  while (words.lastElementChild) {
    words.removeChild(words.lastElementChild);
  }
  //Pour chaque mot
  for (let result in currentData.data.totalQueryFrequency) {
    const text = result + " : " + currentData.data.totalQueryFrequency[result];
    words.appendChild(createElementFromText("p", text));
  }
}
function updateResults() {
  while (results.lastElementChild) {
    results.removeChild(results.lastElementChild);
  }

  const text = "Ratio total : " + cleanRatio(currentData.data.totalRatio);
  results.appendChild(createElementFromText("h4", text));

  for (let section of currentData.data.sectionedText) {
    results.appendChild(createDivSquare(section.ratio, section.id));
  }
}

function lookupQueries(queries, text, lineSectionId) {
  for (let query of queries) {
    query.regex = new RegExp(query.root, "gi");
    text = text.replace(query.regex, (match) => `<mark data-id="${lineSectionId}" data-query="${query.lemma}" onclick="deleteMark(this)">${match}</mark>`);
  }
  text = text.split("/n").join("<br>");
  return text;
}

async function submit(form) {
  const reqBody = {
    fileID: document.querySelector("select").value,
    queries: getCurrentQueries(),
    precision: parseInt(document.getElementById("precision").value),
  };

  currentData = await Api.getAlgoResult(reqBody);
  showData();
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

function makeFile(file) {
  const select = createElementFromText("option", file.name);
  select.setAttribute("value", file.id);

  return select;
}

function createDivSquare(divRatio, pos) {
  pos = parseInt(pos);
  const precision = currentData.data.precision;
  const square = document.createElement("div");

  let color = 255 - divRatio * precision * 2 * 255;
  color = color > 0 ? color : 0;

  square.setAttribute(
    "style",
    "background-color: rgb(" + color + "," + color + "," + color + ")"
  );
  square.setAttribute("class", "square");

  if (divRatio > 0) {
    square.appendChild(createSquareTooltip(pos, divRatio, precision));
  }

  return square;
}

function createSquareTooltip(pos, divRatio, precision) {
  divRatio = cleanRatio(divRatio);
  const lineRange = (pos * precision - precision) + " - " + (pos * precision);
  const tooltip = createElementFromText(
    "span",
    lineRange + ":<br> " + divRatio
  );
  tooltip.setAttribute("class", "tooltiptext");
  return tooltip;
}

function deleteMark(mark) {
  const queryName = mark.getAttribute("data-query")
  const sectionID = mark.getAttribute("data-id")

  mark.replaceWith(mark.innerHTML);

  //Enleve des resultats totaux
  currentData.data.totalQueryFrequency[queryName]--;
  updateWords();

  //Enleve du ratio total
  currentData.data.totalRatio = getTotalRatio();
  //Enleve des resultats de la section
  currentData.data.sectionedText[sectionID-1].queryFrequency[queryName]--;
  //Enleve du ratio de la section
  currentData.data.sectionedText[sectionID-1].ratio = getSectionRatio(sectionID);

  updateResults();
}

function findLineSectionID(targetLine) {
  for (let section of currentData.data.sectionedText) {
    for (let line of section.text) {
      if (line.id === targetLine.id) {
        return section.id;
      }
    }
  }
}


function getTotalRatio(){
  const textLength = currentData.data.text.length;
  let totalHits = 0;

  for (let query in currentData.data.totalQueryFrequency) {
    totalHits += currentData.data.totalQueryFrequency[query];
  }

  return totalHits / textLength;
};

function getSectionRatio(sectionID){
  const section = currentData.data.sectionedText[sectionID-1];
  let totalHits = 0;

  for (let query in section.queryFrequency) {
      totalHits += section.queryFrequency[query];
  }

  return totalHits / section.length;
}