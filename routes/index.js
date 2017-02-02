const express = require('express');
const router = express.Router();

// Custom server .js files
const anagram = require('../server/anagram-server');

/* Request routing */

router.get('/', (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const userAgent = headers['user-agent'];

    res.render('anagram', {
        title: 'The Anagram App',
        description: 'Your one-stop shop for anagrams',
        keywordlist: "anagram, anagram app, anagram finder, anagram solver, anagram game",
        version: '1.0.0'
    });
});

router.get('/search', (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const userAgent = headers['user-agent'];

    if (req.query.q !== '') {
        res.send(anagram.solveAnagram(req.query.q, false));
    }
});

router.get('/game', (req, res, start) => {
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const userAgent = headers['user-agent'];

    res.render('game', {
        title: 'The Anagram Game',
        description: "Solve as many anagrams as possible within the time limit!",
        keywordlist: "anagram, anagram game, solve anagram, anagram solving game"
    });
});

module.exports = router;