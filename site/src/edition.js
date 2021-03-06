const results = document.getElementById("edition");
const table = document.getElementById("results-table");

let currentData = {};

getData();

function updateTable(e = null, edit = 0, add = false) {
  clearTable();

  const headerRow = createRowFromElements(
    [
      createElementFromText("p", "Lemme"),
      createElementFromText("p", "Racine"),
      createElementFromText("p", "Options"),
      createElementFromText("p", "Pondération"),
    ],
    true
  );
  table.appendChild(headerRow);

  if (currentData?.words) {
    updateCurrentWords(edit);
  }

  table.appendChild(add ? createNewWordRow() : createButton(startAdding, "+"));
}

function updateCurrentWords(edit) {
  for (let word of currentData.words) {
    table.appendChild(
      word.id === edit ? createNewWordRow(word) : createWordRow(word)
    );
  }
}

function createWordRow(word) {
  const button = createButton(startEditing, "Modifier", word.id);
  button.setAttribute("class", "bouton");

  return createRowFromElements([
    createElementFromText("p", word.lemma),
    createElementFromText("p", word.root),
    createElementFromText("p", word.weight),
    button,
  ]);
}

function createNewWordRow(word = null) {
  const lemmaInput = createInput(word?.lemma, "lemma-input");

  const rootInput = createInput(word?.root, "root-input");

  const weightInput = createInput(word?.weight, "weight-input");

  const confirmButton = createButton(
    word ? editWord : newWord,
    "Confirmer",
    word?.id
  );
  confirmButton.setAttribute("class", "bouton");

  const wordRow = createRowFromElements([lemmaInput, rootInput, weightInput, confirmButton]);

  if (word) {
    const deleteButton = createButton(deleteWord, "Supprimer", word.id);
    deleteButton.setAttribute("class", "bouton");

    wordRow.lastElementChild.appendChild(deleteButton);
  }

  const cancelButton = createButton(updateTable, "-");
  cancelButton.setAttribute("class", "bouton");

  wordRow.lastElementChild.appendChild(cancelButton);

  return wordRow;
}

function startAdding(e) {
  updateTable(e, 0, true);
}

function clearTable() {
  while (table.lastElementChild) {
    table.removeChild(table.lastElementChild);
  }
}

function startEditing(e) {
  updateTable(e, parseInt(e.srcElement.value));
}

async function deleteWord(e) {
  currentData = await Api.delete({ id: parseInt(e.srcElement.value) });
  updateTable();
}

async function editWord(e) {
  const newWord = createNewWord(parseInt(e.srcElement.value));
  currentData = await Api.put(newWord);
  updateTable();
}

async function newWord(e) {
  const newWord = createNewWord();
  currentData = await Api.post(newWord);
  updateTable();
}

async function getData() {
  currentData = await Api.getAllWords();
  updateTable();
}

function createNewWord(id = null) {
  const lemma = document.getElementById("lemma-input").value;
  const root = document.getElementById("root-input").value;
  const weight = document.getElementById("weight-input").value;

  const newWord = {
    lemma: lemma,
    root: root,
    weight: weight,
  };

  if (id) { newWord[id] = id }
  return newWord;
}