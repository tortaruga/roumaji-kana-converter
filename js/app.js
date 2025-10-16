import hiragana from './data-files/hiragana.js';
import katakana from './data-files/katakana.js';

const punctuationLatin = [',','.','-','!','?'];
const punctuationJapanese = ['、','。','-','！','？'];

// create array of symbols for each script
const hiraganaArray = [];
hiragana.forEach(item => hiraganaArray.push(item.kana));

const roumajiArray = [];
hiragana.forEach(item => roumajiArray.push(item.roumaji));
roumajiArray.push('si', 'tu'); // support alternative romanizations

const katakanaArray = [];
katakana.forEach(item => katakanaArray.push(item.kana));

// create maps for script conversions
const roumajiToHiraganaMap = new Map();
const hiraganaToRoumajiMap = new Map();

const katakanaToRoumajiMap = new Map();
const roumajiToKatakanaMap = new Map();

const kanaToRoumajiMap = new Map();

const katakanaToHiraganaMap = new Map();
const hiraganaToKatakanaMap = new Map();

// populate maps correct pairs:
// roumaji to hiragana and vice versa
roumajiArray.forEach((letter, index) => roumajiToHiraganaMap.set(letter, hiraganaArray[index]));
// support alternative romanizations
roumajiToHiraganaMap.set('si', 'し');
roumajiToHiraganaMap.set('tu', 'つ');
// add punctuation
punctuationLatin.forEach((symbol, index) => roumajiToHiraganaMap.set(symbol, punctuationJapanese[index]));

hiraganaArray.forEach((kana, index) => hiraganaToRoumajiMap.set(kana, roumajiArray[index]));
punctuationJapanese.forEach((symbol, index) => hiraganaToRoumajiMap.set(symbol, punctuationLatin[index]));
// roumaji to katakana and vice versa
roumajiArray.forEach((letter, index) => roumajiToKatakanaMap.set(letter, katakanaArray[index]));
// support alternative romanizations
roumajiToKatakanaMap.set('si', 'シ');
roumajiToKatakanaMap.set('tu', 'ツ'); 
punctuationLatin.forEach((symbol, index) => roumajiToKatakanaMap.set(symbol, punctuationJapanese[index]));
punctuationJapanese.forEach((symbol, index) => katakanaToRoumajiMap.set(symbol, punctuationLatin[index]));

katakanaArray.forEach((kana, index) => katakanaToRoumajiMap.set(kana, roumajiArray[index]));
// mixed kana (hiragana and katakana) to roumaji
hiraganaArray.forEach((kana, index) => kanaToRoumajiMap.set(kana, roumajiArray[index]));
katakanaArray.forEach((kana, index) => kanaToRoumajiMap.set(kana, roumajiArray[index]));
punctuationJapanese.forEach((symbol, index) => kanaToRoumajiMap.set(symbol, punctuationLatin[index]));

// hiragana -> katakana and vice versa
hiraganaArray.forEach((hiragana, index) => hiraganaToKatakanaMap.set(hiragana, katakanaArray[index]));
katakanaArray.forEach((katakana, index) => katakanaToHiraganaMap.set(katakana, hiraganaArray[index]));
// add small kana pairings
const smallHiragana = ['ゃ', 'ゅ', 'ょ'];
const smallKatakana = ['ャ', 'ュ', 'ョ'];
smallHiragana.forEach((char, index) => hiraganaToKatakanaMap.set(char, smallKatakana[index]));
smallKatakana.forEach((char, index) => katakanaToHiraganaMap.set(char, smallHiragana[index]));

// kana to roumaji conversion logic
const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const sokuon = new Set(['っ', 'ッ']);
const onbiki = new Set(['ー']);

function kanaToRoumaji(input) {
    const tokens = input.split(''); // divide string into single characters

    const output = [];
    let double = false; // sokuon flag
    tokens.forEach((token, index) => {
      
        // if white space, keep it in
        if (token === ' ') {
            output.push(token);
            return;
        };
      
        // if current token is sokuon, set flag double to true and process next token
        if (sokuon.has(token)) {
            double = true; 
            return;
        }

        // if current token is a small kana, skip this token
        if (smallKana.has(token)) return; 

        let result;
        // for each token, check the following character:
        const nextToken = tokens[index + 1] || '';
        // if next character is small kana, check if after small kana there is also onbiki 
        if (smallKana.has(nextToken)) {
            if (onbiki.has(tokens[index + 2])) {
                // if yes, lookup compound character in map and also double last letter
                let lastLetterIndex = kanaToRoumajiMap.get(token + nextToken).length - 1;
                result = kanaToRoumajiMap.get(token + nextToken) + kanaToRoumajiMap.get(token + nextToken).charAt(lastLetterIndex)
            } else {
                // else only lookup compound character
                result = kanaToRoumajiMap.get(token + nextToken);
            }
        } else if (onbiki.has(nextToken)) {
            // if next token is onbiki, double the last letter of current token
            kanaToRoumajiMap.get(token)
            let lastLetterIndex = kanaToRoumajiMap.get(token).length - 1;
            result = kanaToRoumajiMap.get(token) + kanaToRoumajiMap.get(token).charAt(lastLetterIndex);
        } else {
            // if next character is neither small or onbiki, lookup normal current token 
            result = kanaToRoumajiMap.get(token);
        }

        // if double flag was set as true, double the first letter of the result
        double ? output.push(result.charAt(0) + result) : output.push(result);
        // set flag back to false for next character evaluation
        double = false; 
        }
    ) 

    return output.join('');
}

const test = 'コンピューター を つかって べんきょうしましょう';  
// console.log(kanaToRoumaji(test));

// roumaji to kana conversion logic
const validSyllables = new Set([... roumajiArray]); // built set of valid roumaji syllables
punctuationLatin.forEach(symbol => validSyllables.add(symbol));

function roumajiToKana(input, map, script = 'hiragana') {
    let output = '';

    const validScript = 'abcdefghijklmnopqrstuvwxyz'.split('');
    
    input.toLowerCase().split('').forEach(char => {
        if (!validScript.includes(char)) {
            handleError();
        }
    })

    const words = input.toLowerCase().split(' '); // split sentence into words

    words.forEach(word => {
        // if 'wa' is alone, treat it as particle
        if (word === 'wa') {
            output += 'は';
            return;
        }

        // consider chunks of 3 letters and check whether they are a valid syllable
        // if not, check chunk of 2 letters
        // if still not valid, use chunk of 1 letter
        // also consider chunks of 4 letters if there's a double consonant
        while (word.length > 0) {
            resetError();
            // if there's a double consonant at the beginning of a 4 letter chunk, 
            // add a small tsu character + the last 3 letters of the chunk
            // ttsu tt
            if (isConsonantDouble(word.substring(0, 4)) && validSyllables.has(word.substring(1, 4))) {
                let syllable = map.get(word.substring(0, 4).slice(1)) || map.get(word.substring(0, 4).slice(1).slice(0, -1)) + map.get(word.substring(0, 4).slice(-1)); 
                output += map.get("(pause)") + syllable;
                word = word.slice(4); // eliminate the 4 letters from word and continue checking
                continue; 
            } else if (validSyllables.has(word.substring(0, 3))) {
                // if 3 letter chunk is valid sillable, check if there's a long vowel (only for katakana)
                if (isVowelLong(word.substring(0, 4), map) && script === 'katakana') {
                    // if so, add onbiki, remove considered letters from word, and continue checking
                    output += map.get(word.substring(0, 4).slice(0, -1)) + "ー";
                    word = word.slice(4);
                    continue;
                }
                // else, lookup normal syllable and update word
                output += map.get(word.substring(0, 3));
                word = word.slice(3);
            } else if (isConsonantDouble(word.substring(0, 3))) {
                // handle double consonant if present
                output += map.get("(pause)") + map.get(word.substring(0, 3).slice(1));
                word = word.slice(3);
            } else if (validSyllables.has(word.substring(0, 2))) {
                // do same process for chunks of 2 letters
                if (isVowelLong(word.substring(0, 3), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 3).slice(0, -1)) + "ー";
                    word = word.slice(3);
                    continue;
                } else {
                    output += map.get(word.substring(0, 2));
                    word = word.slice(2);
                }
            } else if (validSyllables.has(word.substring(0, 1))) {
                // do same thing for chunks of 1 letter
                if (isVowelLong(word.substring(0, 2), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 2).slice(0, -1)) + "ー";
                    word = word.slice(2);
                    continue;
                } else {
                    output += map.get(word.substring(0, 1));
                    word = word.slice(1);  
                }
            } else {
                break; // handle invalid characters in input to avoid infinite loop
            }
        }
    })
    

    return output.replaceAll('undefined', ''); 
}

const roumaji = 'gakkou de isshou ni koohii wo nomimashou'
// console.log(roumajiToKana(roumaji, roumajiToHiraganaMap, 'hiragana')); 

 
function isVowelLong(input) { 
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return (vowels.includes(input[input.length - 1]) && input[input.length - 2] === input[input.length - 1]) 
}


function isConsonantDouble(input) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return (!vowels.includes(input[0]) && input[1] === input[0])
}

// kana to kana conversion logic
function convert(map, input, to) {
    let output = '';
    // split sentence into individual kana
    input.split('').forEach((kana, index) => {
        if (!map.get(kana)) {
            handleError();
            return;
        } else {
            resetError();
        }
        // if kana is onbiki, double preceeding vowel
        if (kana === 'ー' && to === 'hiragana') {
            const vowel = kanaToRoumajiMap.get(input[index - 1]).slice(-1);
            const vowelKana = roumajiToHiraganaMap.get(vowel);
           output += vowelKana; 
           return;
        }
        // else proceed with normal lookup
        output += map.get(kana);
    })

    return output;
}

// console.log(convert(hiraganaToKatakanaMap, "かーど", 'katakana'));

const inputs = document.querySelectorAll('input[type="text"]');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.id === 'roumaji-input') {
            document.getElementById('hiragana-output').value = roumajiToKana(input.value, roumajiToHiraganaMap, 'hiragana');
            document.getElementById('katakana-output').value = roumajiToKana(input.value, roumajiToKatakanaMap, 'katakana');
        }

        if (input.id === 'kana-input') {
            document.getElementById('roumaji-output').value = kanaToRoumaji(input.value);
        }

        if (input.id === 'katakana-input') {
            document.getElementById('hiragana-output-kana').value = convert(katakanaToHiraganaMap, input.value, 'hiragana');
        }
        
        if (input.id === 'hiragana-input') {
            document.getElementById('katakana-output-kana').value = convert(hiraganaToKatakanaMap, input.value, 'katakana');
        }
    })
})

const outputTexts = document.querySelectorAll('.output-text');
outputTexts.forEach(text => {
    text.addEventListener('click', copyToClipboard)
});

function copyToClipboard(e) {
  // Get the text field
  const textField = e.target;

  // Select the text field
  textField.select();
  textField.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(textField.value);

  // Alert the copied text
//   alert("Copied the text: " + textField.value);
}

function handleError() {
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = 'Invalid Script');
}

function resetError() {
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');
}