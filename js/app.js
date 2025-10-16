import * as maps from './maps.js'; 
import { resetError } from './helperFunctions.js';
import { kanaToRoumaji } from './conversion-functions/toRoumaji.js';
import { roumajiToKana } from './conversion-functions/roumajiToKana.js';
import { convert } from './conversion-functions/kanaToKana.js';

const inputs = document.querySelectorAll('input[type="text"]');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.id === 'roumaji-input') {
            document.getElementById('hiragana-output').value = roumajiToKana(input.value, maps.roumajiToHiraganaMap, 'hiragana');
            document.getElementById('katakana-output').value = roumajiToKana(input.value, maps.roumajiToKatakanaMap, 'katakana');
        }

        if (input.id === 'kana-input') {
            document.getElementById('roumaji-output').value = kanaToRoumaji(input.value, maps.kanaToRoumajiMap);
        }

        if (input.id === 'katakana-input') {
            document.getElementById('hiragana-output-kana').value = convert(maps.katakanaToHiraganaMap, input.value, 'hiragana');
        }
        
        if (input.id === 'hiragana-input') {
            document.getElementById('katakana-output-kana').value = convert(maps.hiraganaToKatakanaMap, input.value, 'katakana');
        }
    })
})


// copy to clipboard
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
 const alert = document.querySelector('.copied-alert');

  // Reset animation
  alert.style.animation = 'none';
  alert.offsetHeight; // Trigger reflow
  alert.style.animation = 'copied-alert 2s both';
}


// reset error message on tab change
const tabBtns = document.querySelectorAll('.nav-link');

tabBtns.forEach(btn => btn.addEventListener('click', resetError));