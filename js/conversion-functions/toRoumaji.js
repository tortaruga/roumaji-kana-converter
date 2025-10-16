import * as func from '../helperFunctions.js';

// kana to roumaji conversion logic
const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const sokuon = new Set(['っ', 'ッ']);
const onbiki = new Set(['ー']);

export function kanaToRoumaji(input, map) {
    const tokens = input.split(''); // divide string into single characters

    const output = [];
    let double = false; // sokuon flag
    
    tokens.forEach((token, index) => {
        if (!func.isValidKatakana(token) && !func.isValidHiragana(token) && !func.isValidFullWidth(token)) { 
            func.handleError();
            return;
        } else {
            func.resetError();
        }
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

        let result; // result of each token's conversion

        // for each token, check the following characters (if they exists):
        const nextToken = tokens[index + 1] || '';
        const tokenAfterNext = tokens[index + 2] || '';

        // if next character is small kana, check if after small kana there is also onbiki 
        if (smallKana.has(nextToken)) {
            if (onbiki.has(tokenAfterNext)) {
                // if yes, lookup compound character in map and also double last letter
                let lastLetterIndex = map.get(token + nextToken).length - 1;
                result = map.get(token + nextToken) + map.get(token + nextToken).charAt(lastLetterIndex);
            } else {
                // else only lookup compound character
                result = map.get(token + nextToken);
            }
        } else if (onbiki.has(nextToken)) {
            // if next token is onbiki, double the last letter of current token
            let lastLetterIndex = map.get(token).length - 1;
            result = map.get(token) + map.get(token).charAt(lastLetterIndex);
        } else {
            // if next character is neither small or onbiki, lookup normal current token 
            result = map.get(token);
        }

        // if double flag was set as true, double the first letter of the result
        // then push result to output
        double ? output.push(result.charAt(0) + result) : output.push(result);
        // set flag back to false for next character evaluation
        double = false; 
        }
    ) 

    return output.join(''); // return converted string;
}
