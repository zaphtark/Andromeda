//Récupère les éléments à remplir
const text = document.getElementById("text");
const results = document.getElementById("results");
const words = document.getElementById("words");
const form = document.getElementById("form");

//Variables globales qui contiennent le contenu actuel à afficher
let currentData = {};
let currentQuery = "";

let currentNav = 0;

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

function showAllData() {
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
      const lineID = findLineSectionID(line);
      const lineText = lookupQueries(currentData.data.queries, line.text, lineID) || line.text;
      const lineTag = createElementFromText("p", lineText);
      lineTag.setAttribute("data-section", lineID)
      text.appendChild(lineTag);
    }
  }

  //Mettre les ID sur les mark
  addMarkId()

  //Ajoute les tags sur les mots qui ne sont pas markes
  addClickToAddTags();
 
  //Ajoute boutons de navigation
  currentNav = 0;
  updateNavButtons();
}

function updateNavButtons(){
  const buttonsDiv = document.getElementById("textbuttons");
  while (buttonsDiv.lastElementChild) {
    buttonsDiv.removeChild(buttonsDiv.lastElementChild);
  }

  let totalHits = 0;

  for (let query in currentData.data.totalQueryFrequency) {
    totalHits += currentData.data.totalQueryFrequency[query];
  }
  
  if(currentNav > 1){
    const lastButton = createButton(goBack, "<");
    lastButton.setAttribute("class","bouton");

    const lastLink = document.createElement("a",)
    lastLink.setAttribute("href","#result"+(currentNav-1))
    lastLink.appendChild(lastButton);
    buttonsDiv.appendChild(lastLink);
  }

  if(currentNav < totalHits){
    const nextButton = createButton(goNext, ">");
    nextButton.setAttribute("class","bouton");

    const nextLink = document.createElement("a",)
    nextLink.setAttribute("href","#result"+(currentNav+1))
    nextLink.appendChild(nextButton);
    buttonsDiv.appendChild(nextLink);
  }

  buttonsDiv.appendChild(createElementFromText("p",currentNav+" / "+totalHits));
}

function goNext(e){
  currentNav++;
  addMarkId();
  updateNavButtons();
}

function goBack(e){
  currentNav--;
  addMarkId();
  updateNavButtons();
}

function addMarkId(){
  let markCounter = 0;
  for(let mark of text.querySelectorAll("mark")){
    markCounter++;
    mark.setAttribute("id","result"+markCounter);
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
    query.regex = new RegExp(`([${allGreekChars}]{1,99})?${query.root}[${allGreekChars}]{1,99}`, "gi");
    text = text.replace(query.regex, (match) =>{
      const tooltipTag = `<span class="tooltiptext">${query.lemma}<br>Section ${lineSectionId}</span> `;
      const markTag =  `<mark data-content="${match}" data-id="${lineSectionId}" data-query="${query.lemma}" onclick="deleteMark(this)">${match}${tooltipTag}</mark>`;
      return markTag;
    });
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
  showAllData();
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

  let color = 255 - (divRatio * precision * 2 * 255);
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
    pos+ " : " + lineRange + ":<br> " + divRatio
  );
  tooltip.setAttribute("class", "tooltiptext");
  return tooltip;
}

function deleteMark(mark) {
  const queryName = mark.getAttribute("data-query")
  const sectionID = mark.getAttribute("data-id")
  const word = mark.getAttribute("data-content")
  const spanTag = createAddButtonTag(word,sectionID);

  mark.parentNode.replaceChild(spanTag,mark);

  //Enleve des resultats totaux
  currentData.data.totalQueryFrequency[queryName]--;
  //Enleve du ratio total
  currentData.data.totalRatio = getTotalRatio();
  //Enleve des resultats de la section
  currentData.data.sectionedText[sectionID-1].queryFrequency[queryName]--;
  //Enleve du ratio de la section
  currentData.data.sectionedText[sectionID-1].ratio = getSectionRatio(sectionID);

  updateWords();
  updateResults();
  updateNavButtons();
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

function addClickToAddTags(){
  const lines = text.querySelectorAll("p");
  let inMark = false;
  for(let line of lines){
    const lineTags = [];
    const lineID = parseInt(line.getAttribute("data-section"));
    for(let word of line.innerHTML.split(" ")){

      //Debut d'un mark
      if(word==="<mark"){
        inMark = true;
        lineTags.push([word]);
        continue;
      }

      //Fin d'un mark
      if(word.slice(0,7)==="</mark>"){
        inMark = false;
        lineTags[lineTags.length-1].push(word);
        lineTags[lineTags.length-1] = lineTags[lineTags.length-1].join(" ");
        continue;
      }

      if(inMark){
        lineTags[lineTags.length-1].push(word);
      }
      else{
        lineTags.push(createAddButtonText(word,lineID));
      }
    }
    line.innerHTML = lineTags.join(" ")
  }
}

function createAddButtonText(word,lineID){
  return `<span class="word" data-id="${lineID}" data-content="${word}" onclick="addMark(this)">${word}</span> `;
}

function createAddButtonTag(word,lineID){
  const spanTag = createElementFromText("span", word);
  spanTag.setAttribute("data-id",lineID);
  spanTag.setAttribute("data-content",word);
  spanTag.setAttribute("onclick", "addMark(this)");
  spanTag.setAttribute("class","word");
  return spanTag;
}

function addMark(span) {
  const sectionID = span.getAttribute("data-id");
  const spanContent = span.getAttribute("data-content");

  const tooltipTag = `<span class="tooltiptext">Mot personnalisé<br>Section ${sectionID}</span> `;
  const markTag = document.createElement("mark");
  markTag.setAttribute("data-content", spanContent);
  markTag.setAttribute("data-id", sectionID);
  markTag.setAttribute("data-query", "Mot personnalisé");
  markTag.setAttribute("onclick","deleteMark(this)");
  markTag.innerHTML = spanContent + tooltipTag

  span.parentNode.replaceChild(markTag,span);

  //Ajoute aux resultats totaux
  currentData.data.totalQueryFrequency["Mot personnalisé"] = ~~currentData.data.totalQueryFrequency["Mot personnalisé"]+1;
  //Ajoute au ratio total
  currentData.data.totalRatio = getTotalRatio();
  //Ajoute aux resultats de la section
  currentData.data.sectionedText[sectionID-1].queryFrequency["Mot personnalisé"] =  ~~currentData.data.sectionedText[sectionID-1].queryFrequency["Mot personnalisé"]+1;
  //Ajoute au ratio de la section
  currentData.data.sectionedText[sectionID-1].ratio = getSectionRatio(sectionID);

  updateWords();
  updateResults();
  updateNavButtons();
}
