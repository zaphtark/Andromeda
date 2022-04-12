function getSectionID(targetLine) {
    for (let section of currentData.data.sectionedText) {
        for (let line of section.text) {
            if (line.id === targetLine.id) {
                return section.id;
            }
        }
    }
}

function getTotalRatio() {
    const textLength = currentData.data.text.length;
    return currentData.data.totalHits / textLength;
};

function getSectionRatio(sectionID) {
    const section = currentData.data.sectionedText[sectionID - 1];
    return section.totalHits / section.length;
}

//all Greek Chars for the regex
const allGreekChars = "α-ωΑ-ΩΗΙΟΥΩᾼῌῼΡΆΈΉΊΌΎΏᾺῈῊῚῸῪῺἈἘἨἸὈὨᾈᾘᾨἌἜἬἼὌὬᾌᾜᾬἊἚἪἺὊὪᾊᾚᾪἎἮἾὮᾎᾞᾮἉἙἩἹὉὙὩᾉᾙᾩῬἍἝἭἽὍὝὭᾍᾝᾭἋἛἫἻὋὛὫᾋᾛᾫἏἯἿὟὯᾏᾟᾯΪΫᾹῙῩᾸῘῨἀἁάέίύςἂἃἄἅἆἇὰᾶᾰᾱᾳᾀᾁᾂᾃᾄᾄᾅᾆᾇᾲᾷᾴἐἑἒἓἔἕὲἠἡήἢἣἤἥἦἧὴῆῃᾐᾑᾒᾓᾔᾕᾖᾗῂῇῄἰἱἲἳἴἵἶἷὶῖῗῒΐῐῑὀὁὂὃὄὅὸὐὑὒὓὔὕὖὗὺύῦῧῢΰῠῡὠὡὢὣὤὥὦὧὼώῶῳᾠᾡᾢᾣᾤᾥᾦᾧῲῷῴ";

const fillerWords = ["δὲ", "δ'", "αἰ", "θ'", "Ὁ", "ὁ", "τῶν", "καὶ", "", " "];

//Transforms ugly ratio to x.xxx% format
function cleanRatio(ratio) {
    return (ratio * 100).toFixed(3) + "%";
}

function lookupQueries(queries, text, lineSectionId, lineID) {
    for (let query of queries) {
        query.regex = new RegExp(`([${allGreekChars}]{1,99})?${query.root}[${allGreekChars}]{1,99}`, "gi");
        text = text.replace(query.regex, (match) => {
            const tooltipTag = `<span class="tooltiptext">${query.lemma}<br>Section ${lineSectionId}</span> `;
            const markTag = `<mark data-content="${match}" data-id="${lineSectionId}" data-line="${lineID}" data-query="${query.lemma}" onclick="deleteMark(this)">${match}${tooltipTag}</mark>`;
            return markTag;
        });
    }
    text = text.split("/n").join("<br>");
    return text;
}

function sortWords(frequency) {
    const wordArray = [];
    for (const entries of Object.entries(frequency)) {
        wordArray.push(entries);
    }
    wordArray.sort((a,b)=>b[1]-a[1]);
    return wordArray;
}