import { roumajiArray, punctuationLatin, numbers } from "../maps.js";
import * as func from '../helperFunctions.js';

// roumaji to kana conversion logic
const validSyllables = new Set([... roumajiArray]); // built set of valid roumaji syllables
punctuationLatin.forEach(symbol => validSyllables.add(symbol));
numbers.forEach(symbol => validSyllables.add(symbol));

export function roumajiToKana(input, map, script = 'hiragana') {
    const letters = input.split('');
    letters.forEach(letter => {
        if (!func.isValidLatin(letter)) {
            func.handleError();
            return;
        } else {
            func.resetError();
        }
    })

    let output = '';

    const words = input.toLowerCase().split(' '); // split sentence into words

    words.forEach(word => {
        // if 'wa' is alone, treat it as particle
        if (word === 'wa') {
            output += 'は';
            return;
        }

        // method: 
        // consider chunks of 4 letters and check whether they form a valid syllable (with double consonant)
        //  if not, consider chunks of 3 letters
        // if still not valid, check chunk of 2 letters
        // if still not valid, use chunk of 1 letter

        while (word.length > 0) {
            
            // if there's a double consonant at the beginning of a 4 letter chunk, 
            // add a small tsu character + the last 3 letters of the chunk
            // u-ta-tte-ru
            if (func.isConsonantDouble(word.substring(0, 4)) && validSyllables.has(word.substring(1, 4)) && !punctuationLatin.includes(word.substring(0, 1)) && !numbers.includes(word.substring(0, 1))) {
                let lastThreeLettersOfSyllable = map.get(word.substring(0, 4).slice(1)) || ''; 
                output += map.get("(pause)") + lastThreeLettersOfSyllable;
                word = word.slice(4); // eliminate the 4 letters from word and continue checking
                continue; 
            }
            
            // if 3 letter chunk is valid sillable, check if there's a long vowel after (only for katakana since hiragana doesnt use onbiki)
            if (validSyllables.has(word.substring(0, 3))) {
                if (func.isVowelLong(word.substring(0, 4), map) && script === 'katakana') {
                    // if so, add onbiki, remove considered letters from word, and continue checking
                    output += map.get(word.substring(0, 4).slice(0, -1)) + "ー";
                    word = word.slice(4);
                    continue;
                }
                // else, lookup normal syllable and update word
                output += map.get(word.substring(0, 3));
                word = word.slice(3);
                continue;
            } else if (func.isConsonantDouble(word.substring(0, 3)) && validSyllables.has(word.substring(1, 3)) && !numbers.includes(word.substring(0, 1)) && !punctuationLatin.includes(word.substring(0, 1))) {
                // handle double consonant if present
                const syllable = map.get(word.substring(1, 3)) || ''; // to handle cases like "tt", "dd" etc
                output += map.get("(pause)") + syllable;
                word = word.slice(3); 
                continue;
            } 

            // do same process for chunks of 2 letters
            if (validSyllables.has(word.substring(0, 2))) {
                if (func.isVowelLong(word.substring(0, 3), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 3).slice(0, -1)) + "ー";
                    word = word.slice(3);
                    continue;
                } else { 
                    output += map.get(word.substring(0, 2));
                    word = word.slice(2);
                    continue;
                }
            } 

            // do same thing for chunks of 1 letter
            if (validSyllables.has(word.substring(0, 1))) {
                if (func.isVowelLong(word.substring(0, 2), map) && script === 'katakana') {
                    output += map.get(word.substring(0, 2).slice(0, -1)) + "ー";
                    word = word.slice(2);
                    continue;
                } else {
                    output += map.get(word.substring(0, 1));
                    word = word.slice(1);  
                }
            } else {
                word = word.slice(1);  // handle invalid characters in input to avoid infinite loop
                continue;
            }
        }
    })

    return output; 
}
