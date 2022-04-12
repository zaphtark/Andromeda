const databases = require("./databases");
const Text = require("./class/Text");

const texts = {
    texts: [""],
    getById: id => {
        for (let text of texts.texts) {
            if (text.id === id) {
                return text
            }
        }
        return texts.makeNewText(id);
    },
    makeNewText: id => {
        const XMLFile = databases.XMLFilesDB.getById(id);
        const text = new Text(XMLFile);
        texts.texts.push(text);
        return text;
    }
}

module.exports = texts;