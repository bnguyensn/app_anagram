const fs = require('fs');

// ===== *** INITIALISER *** ===== \\

let anagramDictionary; let wordDictionary; let wordLengthDictionary;
let dictionariesOpened = false;

openDictionary();

// Open dictionary
function openDictionary() {
    try {
        anagramDictionary = require('../server_resources/enable1-ang.json');
        // wordDictionary = require('../server_resources/enable1-ang-02.json');
        wordLengthDictionary = require('../server_resources/enable1-ang-03.json');
        dictionariesOpened = true;
        console.log('Dictionaries opened successfully.');
    } catch (err) {
        // TODO: please catch errors properly
        console.log(err);
    }
}

// ===== *** ANAGRAM SOLVER *** ===== \\

function solveAnagram(input, m) {
    if (m) { return solveMultiwordAnagram(input) }
    else { return solveSinglewordAnagram(input); }
}

// Multi-word anagram logic

function solveMultiwordAnagram(q) {

    // TODO: update this

    // 1. Split and sort the query alphabetically into an array of letters.
    let qry = q.split('').sort().join('');

    return q + '!!!'
}

// Single-word anagram logic

function solveSinglewordAnagram(input) {

    // 1. Split and sort the query alphabetically into an array of letters. Then re-join them as a string.
    let query = input.split('').sort().join('');

    // 2. Check if the anagram dictionary has the query. Else return an empty string.
    if (anagramDictionary.hasOwnProperty(query)) {

        // We return the matching entry (an array) in the anagram dictionary.
        return anagramDictionary[query];
    }

    // We return an empty array if no results are found.
    return []
}

// ===== *** ANAGRAM GAME *** ===== \\

// Give a word bank as an array of strings

function giveWordBank(minL, maxL) {
    let wordBankToSent = [];

    if (minL == maxL) {
        wordBankToSent.push(wordLengthDictionary[minL]);
        console.log('pushed word len ' + minL + ' to wordBankToSent');
    } else {
        let l = maxL - minL + 1; // Max length of loop
        while (l--) {
            let i = minL + l; // Remember: the first l will be l - 1, and the loop breaks on l = -1
            let j = wordLengthDictionary[i].length;
            while (j--) {
                wordBankToSent.push(wordLengthDictionary[i][j]);
            }
            console.log('pushed all words with len ' + i + ' to wordBankToSent');
        }
    }

    console.log('length of wordBankToSent ' + wordBankToSent.length);
    return wordBankToSent;
}



// Most of the logic here is similar to how an anagram is solved above

function isInputAnAnagram(input, keyword) {
    let sortedKeyword = keyword.split('').sort().join('');
    let result = false;
    let i = anagramDictionary[sortedKeyword].length;
    while (i--) {
        if (input == anagramDictionary[sortedKeyword][i]) {
            result = true;
        }
    }
    return result
}

// ===== EXPORT ===== \\

module.exports = {
    solveAnagram,
    isInputAnAnagram,
    giveWordBank
};