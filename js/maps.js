import hiragana from './data-files/hiragana.js';
import katakana from './data-files/katakana.js';

// create array of symbols for each script
const hiraganaArray = [];
export const roumajiArray = [];
const katakanaArray = [];

createScriptArray(hiragana, hiraganaArray, 'kana');
createScriptArray(katakana, katakanaArray, 'kana');
createScriptArray(hiragana, roumajiArray, 'roumaji');

function createScriptArray(scriptObj, arr, value) {
    scriptObj.forEach(item => arr.push(item[value]));
}

// create maps for script conversions
export const roumajiToHiraganaMap = new Map();
export const hiraganaToRoumajiMap = new Map();

export const katakanaToRoumajiMap = new Map();
export const roumajiToKatakanaMap = new Map();

export const kanaToRoumajiMap = new Map();

export const katakanaToHiraganaMap = new Map();
export const hiraganaToKatakanaMap = new Map();

// populate maps with correct pairs of characters:
populateMap(roumajiArray, hiraganaArray, roumajiToHiraganaMap); // roumaji to hiragana
populateMap(hiraganaArray, roumajiArray, hiraganaToRoumajiMap); // hiragana to roumaji
populateMap(roumajiArray, katakanaArray, roumajiToKatakanaMap); // roumaji to katakana
populateMap(katakanaArray, roumajiArray, katakanaToRoumajiMap); // katakana to roumaji
populateMap(hiraganaArray, katakanaArray, hiraganaToKatakanaMap); // hiragana to katakana
populateMap(katakanaArray, hiraganaArray, katakanaToHiraganaMap); // katakana to hiragana
populateMap(hiraganaArray, roumajiArray, kanaToRoumajiMap); // add hiragana to mixed kana-roumaji map
populateMap(katakanaArray, roumajiArray, kanaToRoumajiMap); // add katakana to mixed kana-roumaji map

kanaToRoumajiMap.set(' ', ' '); // support white space

function populateMap(arrayFrom, arrayTo, map) {
    arrayFrom.forEach((value, index) => map.set(value, arrayTo[index]));
}

// support alternative romanization spellings
const alternativeSpellingsHiragana = {
    'si': 'し',
    'tu': 'つ',
    'fu': 'ふ',
    'ti': 'ち',
    'zi': 'じ',
    'sya': 'しゃ',
    'zya': 'じゃ',
    'tya': 'ちゃ',
    'syu': 'しゅ',
    'tyu': 'じゅ',
    'syo': 'ちゅ',
    'zyo': 'じょ',
    'tyo': 'ちょ',
};

const alternativeSpellingsKatakana = {
    'si': 'シ',
    'tu': 'ツ',
    'fu': 'フ',
    'ti': 'チ',
    'zi': 'ジ',
    'sya': 'シャ',
    'zya': 'ジャ',
    'tya': 'チャ',
    'syu': 'シュ',
    'tyu': 'ジュ',
    'syo': 'チュ',
    'zyo': 'ジョ',
    'tyo': 'チョ',
};

Object.keys(alternativeSpellingsHiragana).forEach(key => roumajiArray.push(key))

addAlternativeSpelling(roumajiToHiraganaMap, alternativeSpellingsHiragana);
addAlternativeSpelling(roumajiToKatakanaMap, alternativeSpellingsKatakana);

 

function addAlternativeSpelling(map, charactersObject) {
   for (const [key, value] of Object.entries(charactersObject)) {
   map.set(key, value)
  }
}

// support basic punctuation
export const punctuationLatin = [',','.','-','!','?'];
const punctuationJapanese = ['、','。','-','！','？'];

populateMap(punctuationLatin, punctuationJapanese, roumajiToHiraganaMap)
populateMap(punctuationLatin, punctuationJapanese, roumajiToKatakanaMap);
populateMap(punctuationJapanese, punctuationLatin, hiraganaToRoumajiMap);
populateMap(punctuationJapanese, punctuationLatin, katakanaToRoumajiMap);
populateMap(punctuationJapanese, punctuationLatin, kanaToRoumajiMap);
populateMap(punctuationJapanese, punctuationJapanese, hiraganaToKatakanaMap);
populateMap(punctuationJapanese, punctuationJapanese, katakanaToHiraganaMap);

// support numbers
export const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const numbersFullWidth = ['１','２','３','４','５','６','７','８','９','０'];
populateMap(numbers, numbersFullWidth, roumajiToHiraganaMap);
populateMap(numbers, numbersFullWidth, roumajiToKatakanaMap);
populateMap(numbersFullWidth, numbers, kanaToRoumajiMap);
populateMap(numbersFullWidth, numbers, hiraganaToRoumajiMap);
populateMap(numbersFullWidth, numbers, katakanaToRoumajiMap);
populateMap(numbersFullWidth, numbersFullWidth, hiraganaToKatakanaMap);
populateMap(numbersFullWidth, numbersFullWidth, katakanaToHiraganaMap);

// add small kana pairings to hiragana-katakana maps
const smallHiragana = ['ゃ', 'ゅ', 'ょ'];
const smallKatakana = ['ャ', 'ュ', 'ョ'];
smallHiragana.forEach((char, index) => hiraganaToKatakanaMap.set(char, smallKatakana[index]));
smallKatakana.forEach((char, index) => katakanaToHiraganaMap.set(char, smallHiragana[index]));

populateMap(smallHiragana, smallKatakana, hiraganaToKatakanaMap);
populateMap(smallKatakana, smallHiragana, katakanaToHiraganaMap);