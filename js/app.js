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


function kanaToRoumaji(input, system) {
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
                if (system === 'hiragana') { 
                    result = hiraganaToRoumajiMap.get(token + nextToken);
                } else if (system === 'katakana') {
                    result = katakanaToRoumajiMap.get(token + nextToken);
                }
            } else if (onbiki.has(nextToken)) {
                // double last letter
                let lastLetterIndex;
                if (system === 'hiragana') {
                    lastLetterIndex = hiraganaToRoumajiMap.get(token).length - 1; 
                    result = hiraganaToRoumajiMap.get(token) + hiraganaToRoumajiMap.get(token).charAt(lastLetterIndex);
                } else if (system === 'katakana') {
                    lastLetterIndex = katakanaToRoumajiMap.get(token).length - 1; 
                    result = katakanaToRoumajiMap.get(token) + katakanaToRoumajiMap.get(token).charAt(lastLetterIndex);
                }
            } else {
                // look up normal
            
                if (system === 'hiragana') {
                    result = hiraganaToRoumajiMap.get(token);
                } else if (system === 'katakana') {
                    result = katakanaToRoumajiMap.get(token);
                }
            }


            double ? output.push(result.charAt(0) + result) : output.push(result);
            double = false; 
        }
    ) 

    return output.join('');
}

const system1 = 'hiragana';
const test1 = 'しんにゅうせい';  
const system2 = 'katakana';
const test2 = 'サンドイッチ';

console.log(kanaToRoumaji(test1, system1));
console.log(kanaToRoumaji(test2, system2));
 