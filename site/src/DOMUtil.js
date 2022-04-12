//High level DOM util functions

function createElementFromText(type, text) {
    const element = document.createElement(type);
    element.innerHTML = text;
    return element;
}

function createRowFromElements(elements, header = false) {
    const row = document.createElement("tr");
    for (let element of elements) {
        const data = document.createElement(header ? "th" : "td");
        data.appendChild(element);
        row.appendChild(data);
    }
    return row;
}

//Form DOM util functions

function createButton(fn, text, value = null) {
    const button = createElementFromText("button", text);
    button.setAttribute("value", value);
    button.addEventListener("click", fn);
    return button;
}

function createInput(value = "", id = null) {
    const input = document.createElement("input");
    if (value) {
        input.setAttribute("value", value);
    }
    if (id) {
        input.setAttribute("id", id);
    }
    return input;
}

function createFileOption(file) {
    const select = createElementFromText("option", file.name);
    select.setAttribute("value", file.id);

    return select;
}

function createWordCheckbox(word) {
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

function getCurrentCheckboxes() {
    const results = [];
    const markedCheckbox = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    for (let checkbox of markedCheckbox) {
        results.push(checkbox.value);
    }
    return results;
}

//Text DOM util functions

function createAddButtonText(word, sectionID, lineID) {
    return `<span class="word" data-id="${sectionID}" data-line="${lineID}" data-content="${word}" onclick="addMark(this)">${word}</span> `;
}

function createAddButtonTag(word, sectionID, lineID) {
    const spanTag = createElementFromText("span", word);
    spanTag.setAttribute("data-id", sectionID);
    spanTag.setAttribute("data-line", lineID);
    spanTag.setAttribute("data-content", word);
    spanTag.setAttribute("onclick", "addMark(this)");
    spanTag.setAttribute("class", "word");
    return spanTag;
}

function createMarkTag(content, query, sectionID, lineID) {
    const markTag = document.createElement("mark");
    markTag.setAttribute("data-content", content);
    markTag.setAttribute("data-id", sectionID);
    markTag.setAttribute("data-line", lineID);
    markTag.setAttribute("data-query", query);
    markTag.setAttribute("onclick", "deleteMark(this)");

    const tooltipTag = `<span class="tooltiptext">${query}<br>Section ${sectionID}, ligne ${lineID}</span> `;
    markTag.innerHTML = content + tooltipTag
    return markTag
}

function createMarkText(content,query,sectionID, lineID) {
    const tooltipTag = `<span class="tooltiptext">${query.lemma}<br>Section ${sectionID}, ligne ${lineID}</span> `;
    const markText = `<mark data-content="${content}" data-id="${sectionID}" data-line="${lineID}"data-query="${query.lemma}" onclick="deleteMark(this)">${content}${tooltipTag}</mark>`;
    return markText;
}

//Results DOM util functions

function createSquareTooltip(pos, divRatio, precision) {
    divRatio = cleanRatio(divRatio);
    const lineRange = (pos * precision - precision) + " - " + (pos * precision);
    const tooltip = createElementFromText(
        "span",
        pos + " : " + lineRange + ":<br> " + divRatio
    );
    tooltip.setAttribute("class", "tooltiptext");
    return tooltip;
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


//Misc functions
//Check when document is ready then calls fn

function docReady(fn) {
    // see if DOM is already available
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}