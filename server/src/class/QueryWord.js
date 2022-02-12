module.exports = class QueryWord {
  constructor(id, lemma, root, weight) {
    this.id = id;
    this.lemma = lemma;
    this.root = root;
    this.weight = weight || 1;
    this.regex = new RegExp(root, "gi");
  }
};
