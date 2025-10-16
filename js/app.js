import hiragana from './data-files/hiragana.js';
import katakana from './data-files/katakana.js';

const hiraganaArray = [];
hiragana.forEach(item => hiraganaArray.push(item.kana));

const roumajiArray = [];
hiragana.forEach(item => roumajiArray.push(item.roumaji));

const katakanaArray = [];
katakana.forEach(item => katakanaArray.push(item.kana));

const roumajiToHiraganaMap = new Map();
const hiraganaToRoumajiMap = new Map();
const katakanaToRoumajiMap = new Map();
const roumajiToKatakanaMap = new Map();

const kanaToRoumajiMap = new Map();

const katakanaToHiraganaMap = new Map();
katakanaArray.forEach((katakana, index) => katakanaToHiraganaMap.set(katakana, hiraganaArray[index]));
const hiraganaToKatakanaMap = new Map();
hiraganaArray.forEach((hiragana, index) => hiraganaToKatakanaMap.set(hiragana, katakanaArray[index]));

hiraganaArray.forEach((kana, index) => kanaToRoumajiMap.set(kana, roumajiArray[index]));
katakanaArray.forEach((kana, index) => kanaToRoumajiMap.set(kana, roumajiArray[index]));

roumajiArray.forEach((letter, index) => roumajiToHiraganaMap.set(letter, hiraganaArray[index]));
hiraganaArray.forEach((kana, index) => hiraganaToRoumajiMap.set(kana, roumajiArray[index]));
roumajiArray.forEach((letter, index) => roumajiToKatakanaMap.set(letter, katakanaArray[index]));
katakanaArray.forEach((kana, index) => katakanaToRoumajiMap.set(kana, roumajiArray[index]));

// take an input in hiragana
// split into tokens --> check if small kana next to it --> check is small tsu before it
const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const sokuon = new Set(['っ', 'ッ']);
const onbiki = new Set(['ー']);
const smallHiragana = ['ゃ', 'ゅ', 'ょ'];
const smallKatakana = ['ャ', 'ュ', 'ョ'];
smallHiragana.forEach((char, index) => hiraganaToKatakanaMap.set(char, smallKatakana[index]));
smallKatakana.forEach((char, index) => katakanaToHiraganaMap.set(char, smallHiragana[index]));

function kanaToRoumaji(input) {
    // input is a string
    // tokens is an array of single characters
    // tokenized string is an array of objects...
    // for each word of the objects in the array, call kanaToRoumaji, and then add a whitespace 
    // check if the word is wa and if its pos is particle

    // const normalizedInput = input.replaceAll(' ', ''); // remove spaces if present
    const tokens = input.split('');

    const output = [];
    let double = false; // sokuon flag
    tokens.forEach((token, index) => {
        
        // handle white spaces
        if (token === ' ') {
            output.push(token);
            return;
        };

        // if current token is sokuon, push '' and set flag double to true
        // if it isnt:

        // check next character
        // if it is small kana, look compound
        // it it isnt, look normal
        // in both cases, if double is true, double the first letter
        // set double back to false

        // if next character is onbiki, double last letter

        
        if (sokuon.has(token)) {
            double = true; 
            return;
        }

        if (smallKana.has(token)) return; 

            let result;
            // check next character:
            const nextToken = tokens[index + 1] || '';
            if (smallKana.has(nextToken)) {
                // look up compound
                    result = kanaToRoumajiMap.get(token + nextToken);
            } else if (onbiki.has(nextToken)) {
                // double last letter
                let lastLetterIndex;
                    lastLetterIndex = kanaToRoumajiMap.get(token).length - 1; 
                    result = kanaToRoumajiMap.get(token) + kanaToRoumajiMap.get(token).charAt(lastLetterIndex);
            } else {
                // look up normal
                    result = kanaToRoumajiMap.get(token);
            }


            double ? output.push(result.charAt(0) + result) : output.push(result);
            double = false; 
        }
    ) 

    return output.join('');
}

const test = 'コンピューター を つかって べんきょうしましょう';  

console.log(kanaToRoumaji(test));

const roumaji = 'gakkou de isshou ni koohii wo nomimashou'

const validSyllables = new Set([... roumajiArray]); 

function roumajiToKana(input, map, script = 'hiragana') {
    // built set of valid chunks
    // select the longest valid chunk

    let output = '';

    const words = input.toLowerCase().split(' ');

    words.forEach(word => {
        if (word === 'wa') {
            output += 'は';
            return;
        }

        while (word.length > 0) {
            if (isConsonantDouble(word.substring(0, 4))) {
                // k- ko-u
                let syllable = map.get(word.substring(0, 4).slice(1)) || map.get(word.substring(0, 4).slice(1).slice(0, -1)) + map.get(word.substring(0, 4).slice(-1)); 
                output += map.get("(pause)") + syllable;
                word = word.slice(4); 
                continue; 
            } else if (validSyllables.has(word.substring(0, 3))) {
                if (isVowelLong(word.substring(0, 4), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 4).slice(0, -1)) + "ー";
                    word = word.slice(4);
                    continue;
                }
                output += map.get(word.substring(0, 3));
                word = word.slice(3);
            } else if (isConsonantDouble(word.substring(0, 3))) {
                // tte ddo ttsu
                output += map.get("(pause)") + map.get(word.substring(0, 3).slice(1));
                word = word.slice(3);
            } else if (validSyllables.has(word.substring(0, 2))) {
                // check if next letter is vowel and same as last one
                if (isVowelLong(word.substring(0, 3), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 3).slice(0, -1)) + "ー";
                    word = word.slice(3);
                    continue;
                } else {
                    output += map.get(word.substring(0, 2));
                    word = word.slice(2);
                }
            } else if (validSyllables.has(word.substring(0, 1))) {
                // check if next letter is vowel and same as last one
                if (isVowelLong(word.substring(0, 2), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 2).slice(0, -1)) + "ー";
                    word = word.slice(2);
                    continue;
                } else {
                    output += map.get(word.substring(0, 1));
                    word = word.slice(1);  
                }
            } else {
                break;
            }
        }
    })

    console.log(output);
}
 
roumajiToKana(roumaji, roumajiToHiraganaMap, 'hiragana'); 
 
function isVowelLong(input) { 
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return (vowels.includes(input[input.length - 1]) && input[input.length - 2] === input[input.length - 1]) 
}

function isConsonantDouble(input) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return (!vowels.includes(input[0]) && input[1] === input[0])
}

function convert(map, input, to) {
    // "がっこうでいっしょうにこおひいおのみましょう"
    let output = '';
    input.split('').forEach((kana, index) => {
        if (kana === 'ー') {
            const vowel = kanaToRoumajiMap.get(input[index - 1]).slice(-1);
            const vowelKana = to === 'hiragana' ? roumajiToHiraganaMap.get(vowel) : roumajiToKatakanaMap.get(vowel);
           output += vowelKana; 
           return;
        }
        output += map.get(kana);
    })

    console.log(output);
}

convert(katakanaToHiraganaMap, "カード", 'hiragana');