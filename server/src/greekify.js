/*
  Andromeda - greekify.js
  Transforme le betacode de Perseus en texte grec
*/

const utilChar = ["*", "/", "\\", ")", "(", ".", ","];

const greekify = (text) => {
  if (text) {
    text = makeGreekCharacters(text);

    text = makeUpperCase(text);
    text = makeBreathings(text);
    text = makeAccents(text);

    text = correctSigmasBefore(text, " ");
    text = correctSigmasBefore(text, ".");
    text = correctSigmasBefore(text, ",");

    text = text.split("|").join("ι"); //Iota adscript because screw this
  }

  return text;
};

module.exports = greekify;

//Table et transcription de betacode -> caractères grecs

const latToGreek = {
  a: "α",
  b: "β",
  g: "γ",
  d: "δ",
  e: "ε",
  z: "ζ",
  h: "η",
  q: "θ",
  i: "ι",
  k: "κ",
  l: "λ",
  m: "μ",
  n: "ν",
  c: "ξ",
  o: "ο",
  p: "π",
  r: "ρ",
  s: "σ",
  t: "τ",
  u: "υ",
  f: "φ",
  x: "χ",
  y: "ψ",
  w: "ω",
};

makeGreekCharacters = (text) => {
  //Devrait etre une autre fonction
  text = text.split("&mdash").join("—");
  text = text.split("&dagger").join("†")
  text = text.split("&lsquo").join("'") //Pas exactement le bon caractere

  text = text.split("");
  text.forEach((char, i) => {
    char = latToGreek[char] || char;
    text[i] = char;
  });
  return text.join("");
};

//Table et transcription de majuscules

const lowerToUpper = {
  α: "Α",
  β: "Β",
  γ: "Γ",
  δ: "Δ",
  ε: "Ε",
  ζ: "Ζ",
  η: "Η",
  θ: "Θ",
  ι: "Ι",
  κ: "Κ",
  λ: "Λ",
  μ: "Μ",
  ν: "Ν",
  ξ: "Ξ",
  ο: "Ο",
  π: "Π",
  ρ: "Ρ",
  σ: "Σ",
  τ: "Τ",
  υ: "Υ",
  φ: "Φ",
  χ: "Χ",
  ψ: "Ψ",
  ω: "Ω",
};

makeUpperCase = (text) => {
  text = text.split("*");

  text.forEach((part, i) => {
    if (part[0]) {
      part = part.split("");

      let firstLetter = 0;
      while (utilChar.includes(part[firstLetter])) {
        firstLetter++;
      }
      part[firstLetter] = lowerToUpper[part[firstLetter]] || part[firstLetter];
      part = part.join("");
    }
    text[i] = part;
  });

  return text.join("");
};

//Table et transcription d'esprits

const toRough = {
  α: "ἁ",
  Α: "Ἁ",
  ε: "ἑ",
  Ε: "Ἑ",
  η: "ἡ",
  Η: "Ἡ",
  ι: "ἱ",
  Ι: "Ἱ",
  ο: "ὁ",
  Ο: "Ὁ",
  υ: "ὑ",
  Υ: "Ὑ",
  ω: "ὡ",
  Ω: "Ὡ",
};

const toSoft = {
  α: "ἀ",
  Α: "Ἀ",
  ε: "ἐ",
  Ε: "Ἐ",
  η: "ἠ",
  Η: "Ἠ",
  ι: "ἰ",
  Ι: "Ἰ",
  ο: "ὀ",
  Ο: "Ὀ",
  ω: "ὠ",
  Ω: "Ὠ",
};

makeBreathings = (text) => {
  text = replaceLast(text, toSoft, ")");
  text = replaceLast(text, toRough, "(");
  return text;
};

//Table et transcription d'accents
const toActute = {
  α: "ά",
  ἀ: "ἄ",
  ἁ: "ἅ",
  Α: "Ά",
  Ἀ: "Ἄ",
  Ἁ: "Ἅ",
  ε: "έ",
  ἐ: "ἔ",
  ἑ: "ἕ",
  Ε: "Έ",
  Ἐ: "Ἔ",
  Ἑ: "Ἕ",
  η: "ή",
  ἠ: "ἤ",
  ἡ: "ἥ",
  Η: "Ή",
  Ἠ: "Ἤ",
  Ἡ: "Ἥ",
  ι: "ί",
  ἰ: "ἴ",
  ἱ: "ἵ",
  Ι: "Ί",
  Ἰ: "Ἴ",
  Ἱ: "Ἵ",
  ο: "ό",
  ὀ: "ὄ",
  ὁ: "ὅ",
  Ο: "Ό",
  Ὀ: "Ὄ",
  Ὁ: "Ὅ",
  υ: "ύ",
  ὑ: "ὕ",
  Υ: "Ύ",
  Ὑ: "Ὕ",
  ω: "ώ",
  ὠ: "ὤ",
  ὡ: "ὥ",
  Ω: "Ώ",
  Ὠ: "Ὤ",
  Ὡ: "Ὥ",
};

const toGrave = {
  α: "ὰ",
  ἀ: "ἂ",
  ἁ: "ἃ",
  Α: "Ὰ",
  Ἀ: "Ἂ",
  Ἁ: "Ἃ",
  ε: "ὲ",
  ἐ: "ἒ",
  ἑ: "ἓ",
  Ε: "Ὲ",
  Ἐ: "Ἒ",
  Ἑ: "Ἓ",
  η: "ὴ",
  ἠ: "ἢ",
  ἡ: "ἣ",
  Η: "Ὴ",
  Ἠ: "Ἢ",
  Ἡ: "Ἣ",
  ι: "ὶ",
  ἰ: "ἲ",
  ἱ: "ἳ",
  Ι: "Ὶ",
  Ἰ: "Ἲ",
  Ἱ: "Ἳ",
  ο: "ὸ",
  ὀ: "ὂ",
  ὁ: "ὃ",
  Ο: "Ὸ",
  Ὀ: "Ὂ",
  Ὁ: "Ὃ",
  υ: "ὺ",
  ὑ: "ὓ",
  Υ: "Ὺ",
  Ὑ: "Ὓ",
  ω: "ὼ",
  ὠ: "ὢ",
  ὡ: "ὣ",
  Ω: "Ὼ",
  Ὠ: "Ὢ",
  Ὡ: "Ὣ",
};

const toCircumflex = {
  α: "ᾶ",
  ἀ: "ἆ",
  ἁ: "ἇ",
  Ἀ: "Ἆ",
  Ἁ: "Ἇ",
  η: "ῆ",
  ἠ: "ἦ",
  ἡ: "ἧ",
  Ἠ: "Ἦ",
  Ἡ: "Ἧ",
  ι: "ῖ",
  ἰ: "ἶ",
  ἱ: "ἷ",
  Ἰ: "Ἶ",
  Ἱ: "Ἷ",
  υ: "ῦ",
  ὑ: "ὗ",
  Ὑ: "Ὗ",
  ω: "ῶ",
  ὠ: "ὦ",
  ὡ: "ὧ",
  Ὠ: "Ὦ",
  Ὡ: "Ὧ",
};

const toDiaeresis = {
  ι: "ϊ",
  ῖ: "ῗ",
  ί: "ΐ",
  ὶ: "ῒ",
  υ: "ϋ",
  ῦ: "ῧ",
  ύ: "ΰ",
  ὺ: "ῢ",
};

makeAccents = (text) => {
  text = replaceLast(text, toActute, "/");
  text = replaceLast(text, toGrave, "\\");
  text = replaceLast(text, toCircumflex, "=");
  text = replaceLast(text, toDiaeresis, "+");
  return text;
};

//Fonctions utilitaires

replaceLast = (text, table, separator) => {
  text = text.split(separator);

  text.forEach((part, i) => {
    if (text[i - 1]) {
      if (text[i - 1][0]) {
        part = text[i - 1].split("");

        let lastLetter = part.length - 1;
        while (utilChar.includes(part[lastLetter])) {
          lastLetter--;
        }

        part[lastLetter] = table[part[lastLetter]] || part[lastLetter];
        part = part.join("");
      }
    }

    text[i - 1] = part;
  });

  return text.join("");
};

correctSigmasBefore = (text, separator) => {
  text = text.split(separator);

  text.forEach((part, i) => {
    if (text[i - 1]) {
      part = text[i - 1].split("");

      let lastLetter = part.length - 1;
      while (utilChar.includes(part[lastLetter])) {
        lastLetter--;
      }

      part[lastLetter] = part[lastLetter] == "σ" ? "ς" : part[lastLetter];
      part = part.join("");
    }

    text[i - 1] = part;
  });

  return text.join(separator);
};
