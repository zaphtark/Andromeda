//Récupère les éléments à remplir
const text = document.getElementById("text");
const results = document.getElementById("results");
const words = document.getElementById("words");
const relatedWords = document.getElementById("relatedwords");
const form = document.getElementById("form");
const loadingImg = document.querySelector("img");

//Variables globales qui contiennent le contenu actuel à afficher
let currentData = {};
let currentQuery = "";

let currentNav = 0;

//Quand le document est prêt, on crée le formulaire
docReady(createForm);

//Fonctions du formulaire
//Fonction qui ajoute les mots depuis la base de donnée dans le formulaire
async function createForm() {
  const data = {
    words: await Api.getAllWords(),
    files: await Api.getAllFiles()
  }

  for (let word of data.words.words) {
    document.getElementById("queries").appendChild(createWordCheckbox(word));
  }

  for (let file of data.files.files) {
    document.getElementById("textPicker").appendChild(createFileOption(file));
  }

  form.addEventListener("submit", submit);
}

async function submit(form) {
  loadingImg.setAttribute("class", "loading");

  const reqBody = {
    fileID: document.querySelector("select").value,
    queries: getCurrentCheckboxes(),
    precision: parseInt(document.getElementById("precision").value),
  };

  currentData = await Api.getAlgoResult(reqBody);
  
  loadingImg.removeAttribute("class");
  showAllData();
}


function showAllData() {
  updateText();
  updateRelatedWords();
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
      const sectionID = getSectionID(line);
      const lineText = lookupQueries(currentData.data.queries, line.text, sectionID, line.id) || line.text;
      const lineTag = createElementFromText("p", lineText);
      lineTag.setAttribute("data-section", sectionID)
      lineTag.setAttribute("data-line", line.id)
      text.appendChild(lineTag);
    }
  }

  //Mettre les ID sur les mark
  addMarkId();

  //Ajoute les tags sur les mots qui ne sont pas marked
  addClickToAddTags();

  //Ajoute boutons de navigation
  currentNav = 0;
  updateNavButtons();
}

//Navigation functions

function updateNavButtons() {
  const buttonsDiv = document.getElementById("textbuttons");
  while (buttonsDiv.lastElementChild) {
    buttonsDiv.removeChild(buttonsDiv.lastElementChild);
  }

  let totalHits = 0;

  for (let query in currentData.data.totalQueryFrequency) {
    totalHits += currentData.data.totalQueryFrequency[query];
  }

  if (currentNav > 1) {
    const lastButton = createButton(goBack, "<");
    lastButton.setAttribute("class", "bouton");

    const lastLink = document.createElement("a",)
    lastLink.setAttribute("href", "#result" + (currentNav - 1))
    lastLink.appendChild(lastButton);
    buttonsDiv.appendChild(lastLink);
  }

  if (currentNav < totalHits) {
    const nextButton = createButton(goNext, ">");
    nextButton.setAttribute("class", "bouton");

    const nextLink = document.createElement("a",)
    nextLink.setAttribute("href", "#result" + (currentNav + 1))
    nextLink.appendChild(nextButton);
    buttonsDiv.appendChild(nextLink);
  }

  buttonsDiv.appendChild(createElementFromText("p", currentNav + " / " + totalHits));
}

function goNext(e) {
  currentNav++;
  addMarkId(); //Verifier si c'est important
  updateNavButtons();
}

function goBack(e) {
  currentNav--;
  addMarkId(); //Verifier si c'est important
  updateNavButtons();
}

function addMarkId() {
  let markCounter = 0;
  for (let mark of text.querySelectorAll("mark")) {
    markCounter++;
    mark.setAttribute("id", "result" + markCounter);
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

function updateRelatedWords() {
  while (relatedWords.lastElementChild) {
    relatedWords.removeChild(relatedWords.lastElementChild);
  }
  const wordsArray = sortWords(currentData.data.totalRelatedWords);
  //Pour chaque mot
  for (let [word, instances] of wordsArray) {
    if (word && !fillerWords.includes(word)) {
      const text = word + " : " + instances;
      relatedWords.appendChild(createElementFromText("p", text));
    }
  }
}

function recountRelatedWords() {

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


function deleteMark(mark) {
  const queryName = mark.getAttribute("data-query")
  const sectionID = mark.getAttribute("data-id")
  const lineID = mark.getAttribute("data-line")
  const word = mark.getAttribute("data-content")
  const spanTag = createAddButtonTag(word, sectionID, lineID);

  mark.parentNode.replaceChild(spanTag, mark);

  //Enleve des resultats totaux
  currentData.data.totalQueryFrequency[queryName]--;
  currentData.data.totalHits--;
  //Enleve du ratio total
  currentData.data.totalRatio = getTotalRatio();
  //Enleve des resultats de la section
  currentData.data.sectionedText[sectionID - 1].queryFrequency[queryName]--;
  currentData.data.sectionedText[sectionID - 1].totalHits--;
  //Enleve des resultats de la ligne
  for (let i = 0; i < currentData.data.sectionedText[sectionID - 1].text.length; i++) {
    if (currentData.data.sectionedText[sectionID - 1].text[i] === lineID) {
      currentData.data.sectionedText[sectionID - 1].text[i].queryFrequency[query] = ~~currentData.data.sectionedText[sectionID - 1].text[i].queryFrequency[query];
    }
  }
  //Enleve du ratio de la section
  currentData.data.sectionedText[sectionID - 1].ratio = getSectionRatio(sectionID);

  updateWords();
  updateResults();
  updateRelatedWords();
  updateNavButtons();
}

function addClickToAddTags() {
  const lines = text.querySelectorAll("p");
  let inMark = false;
  for (let line of lines) {
    const lineTags = [];
    const sectionID = parseInt(line.getAttribute("data-section"));
    const lineID = parseInt(line.getAttribute("data-line"));
    for (let word of line.innerHTML.split(" ")) {

      //Debut d'un mark
      if (word === "<mark") {
        inMark = true;
        lineTags.push([word]);
        continue;
      }

      //Fin d'un mark
      if (word.slice(0, 7) === "</mark>") {
        inMark = false;
        lineTags[lineTags.length - 1].push(word);
        lineTags[lineTags.length - 1] = lineTags[lineTags.length - 1].join(" ");
        continue;
      }

      if (inMark) {
        lineTags[lineTags.length - 1].push(word);
      }
      else {
        lineTags.push(createAddButtonText(word, sectionID, lineID));
      }
    }
    line.innerHTML = lineTags.join(" ")
  }
}

function addMark(span) {
  const sectionID = span.getAttribute("data-id");
  const lineID = span.getAttribute("data-line");
  const spanContent = span.getAttribute("data-content");
  const query = prompt("De quelle racine?", "Mot personnalisé") || "Mot personnalisé";

  const markTag = createMarkTag(spanContent, query, sectionID, lineID);

  span.parentNode.replaceChild(markTag, span);

  //Ajoute aux resultats totaux
  currentData.data.totalQueryFrequency[query] = ~~currentData.data.totalQueryFrequency[query] + 1;
  currentData.data.totalHits++;
  //Ajoute au ratio total
  currentData.data.totalRatio = getTotalRatio();
  //Ajoute aux resultats de la section
  currentData.data.sectionedText[sectionID - 1].queryFrequency[query] = ~~currentData.data.sectionedText[sectionID - 1].queryFrequency[query] + 1;
  currentData.data.sectionedText[sectionID - 1].totalHits++;
  //Ajoute aux resultats de la ligne
  for (let i = 0; i < currentData.data.sectionedText[sectionID - 1].text.length; i++) {
    if (currentData.data.sectionedText[sectionID - 1].text[i] === lineID) {
      currentData.data.sectionedText[sectionID - 1].text[i].queryFrequency[query] = ~~currentData.data.sectionedText[sectionID - 1].text[i].queryFrequency[query];
    }
  }
  //Ajoute au ratio de la section
  currentData.data.sectionedText[sectionID - 1].ratio = getSectionRatio(sectionID);

  updateWords();
  updateResults();
  updateRelatedWords();
  updateNavButtons();
}
