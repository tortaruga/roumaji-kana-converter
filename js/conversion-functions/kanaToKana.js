import * as func from '../helperFunctions.js';

// kana to kana conversion logic
export function convert(map, input, to) {
    let output = '';
    // split sentence into individual kana
    input.split('').forEach((kana, index) => {
        if (!map.get(kana)) {
            func.handleError();
            return;
        } else {
            func.resetError();
        }
        // if kana is onbiki, double preceeding vowel
        if (kana === 'ー' && to === 'hiragana') {
            // grab last letter of syllable (in roumaji)
            const vowel = kanaToRoumajiMap.get(input[index - 1]).slice(-1);
            // use roumaji vowel to get corresponding kana
            const vowelKana = roumajiToHiraganaMap.get(vowel);
           output += vowelKana; 
           return;
        }
        // else proceed with normal lookup
        output += map.get(kana);
    })

    return output;
}
