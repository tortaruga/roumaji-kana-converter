export function isVowelLong(input) { 
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return (vowels.includes(input[input.length - 1]) && input[input.length - 2] === input[input.length - 1]) 
}

export function isConsonantDouble(input) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return (!vowels.includes(input[0]) && input[1] === input[0])
}

export function isValidLatin(input) {
    return (isInputValid(input, 0x0000, 0x007F));
}

export function isValidKatakana(input) {
    return (isInputValid(input, 0x30A0, 0x30FF)) || isWhiteSpace(input);
}

export function isValidHiragana(input) {
    return (isInputValid(input, 0x3040, 0x309F)) || isWhiteSpace(input);
}

export function isValidFullWidth(input) {
    return (isInputValid(input, 0xFF00, 0xFFEF));
}

export function isInputValid(input, min, max) {
    const code = input.codePointAt(0);
    return code <= max && code >= min; 
}

export function isWhiteSpace(input) {
    return input.codePointAt(0) === 0x0020;
}

export function handleError() {
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = 'Invalid Script');
}

export function resetError() {
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');
}
