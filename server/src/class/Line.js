module.exports = class Line {
    constructor(id, text, divId) {
        this.id = id;
        this.text = text || "";
        this.divId = divId;
        this.length = this.getLength();
    }
    getLength() {
        return this.text.split(" ").length || 0;
    }
}
