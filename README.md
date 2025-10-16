Roumaji-Japanese Converter – Index
- [overview](#overview)
- [features](#project-features)
- [built with](#built-with)
- [obstacles and solutions](#obstacles-and-solutions)
- [some notes on limitations](#notes-on-conversion)
- [things I learned](#things-i-learned)

# overview

This project was created as a hands-on exercise to practice using JavaScript Map objects. Having never worked with Maps before, I wanted a practical and engaging way to explore their functionality—so I decided to build a converter from Latin script to Japanese kana. The project provided a great opportunity to deepen my understanding of Maps while tackling a real-world challenge.


## Project features

- Convert from Roumaji (latin alphabet) to Hiragana and Katakana;
- Convert from Kana (both Hiragana and Katakana supported) to Roumaji;
- Convert from Hiragana to Katakana, and from Katakana to Hiragana;
- Support both [Hepburn](https://en.wikipedia.org/wiki/Hepburn_romanization) romanization system and [Nihon-Shiki](https://en.wikipedia.org/wiki/Nihon-shiki);
- Support numerals and basic punctuation;
- Copy converted text to clipboard by clicking on it;

The project is fully responsive, providing a smooth and comfortable experience across all device sizes. It is also accessible, and supports full keyboard navigation.

## Built with

- Javascript
- HTML5
- Bootstrap
- A tiny bit of custom CSS
- Four days of madness

### Obstacles and Solutions

Being familiar with the rules of romanization, I initially thought implementing the logic would be easy. In fact, I had initially thought about building a converter from Latin to Korean Hangeul for the exercise, but then switched to Japanese Kana because the romanization rules seemed "easier" to implement. They *were* easier than Korean would have been, technically, just not as easy as I originally believed...

#### Conversion

The first major challenge was designing a system that could handle all the edge cases, combinations, and peculiarities of Japanese syllabary.

##### Kana to Romaji
This was relatively straightforward, as each kana maps to a single Latin syllable. The main complications were:

- Double consonants
- Long vowels

These were handled by introducing a flag for double consonants and checking adjacent characters to detect and process vowel elongation.

##### Romaji to Kana

This part was significantly more complex. The converter needed to match the longest valid Latin syllable to its corresponding kana and handle:
- Double consonants
- Long vowels
- Compound characters (e.g., "kya", "shu")
- Compound characters with double consonants (e.g., "kkya")
- Compound characters with long vowels (e.g., "kyaa")
- Compound characters with both double consonants and long vowels (e.g., "kkyaa")
- Account for subtle differences between Hiragana and Katakana (elongating vowels with "ー" vs doubling them)

To solve this, I implemented a chunking strategy: the input is split into segments of 4, 3, 2, or 1 letters (since the longest valid syllables—excluding long vowels—are 4 characters long). Each chunk is then checked to see if it forms a valid syllable and whether it includes any doubling.

##### Kana System Conversion
Converting between Hiragana and Katakana was refreshingly simple, thanks to the bijective correspondence between the two syllabaries, thank heavens.


#### numbers and punctuation
I wanted to support numbers and basic punctuation, since Japanese script typically uses full-width characters for these elements. To do this, I had to:
- Add the corresponding symbols to the conversion maps
- Handle them separately from kana and romaji, ensuring that rules for double consonants and long vowels wouldn’t interfere

In the process of implementing this feature, I accidentally summoned at least a dozen infinite loops, but after some persistent debugging, I finally slayed the beast.

### Notes on conversion 
This converter was built entirely in JavaScript, without relying on any dictionary, parser, or grammar analyzer. As a result, it cannot handle cases where conversion depends on grammatical context. This limitation leads to two main challenges:

1. Word Boundaries 

Japanese text typically does not include spaces, and this tool cannot infer word breaks. Therefore, when converting from kana to romaji, the output will also lack spaces.
I experimented with libraries that parse Japanese text into words, but most of them segment text into morphemes (the smallest meaningful units of language). Unfortunately, this approach doesn’t align well with natural word boundaries and would interfere with the converter’s logic—so I chose not to include it.

2. Particle Ambiguity

The kana "は" is usually romanized as "ha", but when used as a grammatical particle, it’s pronounced and romanized as "wa". Since the converter cannot determine grammatical roles, it always converts "は" to "ha". 
Similarly, when converting from romaji to kana, the syllable "wa" should be rendered as "は" if used as a particle—but the converter defaults to "わ", which is correct only in non-particle contexts.
I attempted a partial fix: if "wa" appears as a standalone syllable, it’s treated as a particle and converted to "は". Otherwise, it’s assumed to mean "わ". This solution works only if the input is split into words (e.g., "watashi wa ningen desu" instead of "watashiwaningendesu"), and it doesn’t handle cases where "は" is attached to a word but functions as a particle (e.g., "konnichiwa", "konbanwa").

⚠️ Limitations

Without a grammar parser or deeper linguistic analysis, these issues cannot be fully resolved. The converter prioritizes simplicity and internal logic over grammatical precision.


### things I learned

#### Bootstrap
I used this project as a chance to sharpen my Bootstrap skills, especially with dynamic components like tabs and accordions. I kept trying to use Tailwind syntax for the breakpoints ("ld:d-flex" instead of "d-lg-flex") and spent a while wondering why it wouldn't work...

Despite the hiccups, Bootstrap made it easy to build a clean, responsive layout quickly and efficiently.

#### Using JSON file
As basis for my Map objects, I started with two JSON files by [mdzhang](https://gist.github.com/mdzhang) ([hiragana file here](https://gist.github.com/mdzhang/899a427eb3d0181cd762), [katakana file here](https://gist.github.com/mdzhang/53b362cadebf2785ca43)). Initially, I tried importing them directly, however I learned that import works in Node.js, but not in the browser environment without a module bundler.

To avoid asynchronous fetch calls and keep things simple, I converted the JSON files into .js files and imported them as plain JavaScript objects.

#### word-break vs word-wrap

- `word-break: break-all` breaks words anywhere, even mid-syllable 
- `word-wrap: break-word` breaks only when necessary, preserving word integrity when possible

#### character blocks
While validating input, I discovered `String.prototype.codePointAt(index)`, which returns the Unicode code point of a character. This method was useful in checking whether the input contained any character that wasn't supported, and display an appropriate error message to the user in such cases.

#### Maps and Sets
This project gave me a solid opportunity to explore the various methods available to Map and Set objects in JavaScript. From .set() and .get() to .has() and .forEach(), I got a lot more comfortable using them in real-world logic.

Initially, I tried using a single Map to handle bidirectional conversions (e.g., a single Map for both Hiragana-to-Roumaji and Roumaji-to-Hiragana), but I realized that retrieving a key by its value is more complex than it seems. In the end, creating separate Map objects—one for each direction—proved to be a cleaner and more efficient solution.

#### offsetHeight to trigger animation
To restart the copied-alert animation (even when users click multiple times in quick succession) I used the offsetHeight property to force a reflow:

    alert.style.animation = 'none';
    alert.offsetHeight; // Trigger reflow
    alert.style.animation = 'copied-alert 2s both';

This technique ensures the animation resets properly by temporarily removing it, triggering a reflow, and then reapplying it.