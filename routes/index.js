const express = require('express');
const router = express.Router();

// Custom server .js files
const anagram = require('../server/anagram');

/* GET home page */

router.get('/', function (req, res, next) {
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const userAgent = headers['user-agent'];

    res.render('index', {
        title: 'The Anagram App',
        description: "Your one-stop shop for anagrams",
        keywordlist: "anagram, anagram app, anagram finder, anagram solver, anagram game"
    });
});

module.exports = router;