$(window).on('load', function() {

    // Loader functions

    let $loaderBkg = $('#loader-bkg');
    TweenLite.to($loaderBkg, .2, {opacity: 0, onComplete: tweenCompleted});
    function tweenCompleted() { $loaderBkg.hide(); }
    console.log('window loaded');
});

$(document).ready(function() {

    const red = '#f44336'; // Red
    const green = '#D4E157'; // Lime 400

    const transSpeed = .5; // Speed of the page transition

    const gameTime = 10; // Default time per round

    // TODO: find out why these variables do not work for our functions below
    // const $playerInput = $('#player-input');
    // let $pageStart = $('#page-start');
    // let $pageGame = $('#page-game');




    // ===== View Model - Handled by vuejs ===== \\

    let app = new Vue({
        el: '#app',
        data: {
            keywordBank: [],
            keyword: '...',
            wordInput: '',
            histTop: '...',
            histMid: '...',
            histBot: '...',
            kEnterUp: true,
            kEscUp: true,
            inputAvailable: true,
            keywordMinL: 3, keywordMaxL: 4,
            gameRunning: false,
            countScore: 0, countCorrect: 0, countSkipped: 0, countTotal: 0,
            gameTimer: {}, gameDuration: gameTime, // in s
            nameInput: 'Anonymous'
        },
        methods: {
            // User clicks Start
            startClicked: function() {
                // The DOM element being passed is for transition purposes. Need to know where is the current page.
                startNewGame(this.keywordMinL, this.keywordMaxL, $('#page-start'));
            },

            // User clicks Restart
            restartClicked: function() {
                // The DOM element being passed is for transition purposes. Need to know where is the current page.
                startNewGame(this.keywordMinL, this.keywordMaxL, $('#page-end'));
            },

            // User clicks End
            endClicked: function() {
                endCurrentGame();
            },

            // User clicks input <div>
            inputClicked: function() {

            },

            // User presses 'Enter'
            wordInputKDEnter: function() {
                if (this.kEnterUp) {
                    this.kEnterUp = false;
                    // Validate and compare input with the keyword
                    if (inputValidated(this.wordInput) && this.inputAvailable) {
                        this.inputAvailable = false; // Prevent doing stuff when server is still processing input
                        isInputAnAnagram(this.wordInput, this.keyword);
                        // DO NOT process result here because ajax call
                    } else {
                        this.wordInput = '';
                        flashInput(red);
                        console.log('Input cant be the same as keyword');
                    }
                }
            },
            wordInputKUEnter: function() {
                this.kEnterUp = true;
            },

            nameInputKDEnter: function() {
                if (this.kEnterUp) {
                    this.kEnterUp = false;
                        // Submit name
                }
            },
            nameInputKUEnter: function() {
                this.kEnterUp = true;
            },

            // User presses 'ESC'
            gameKDEsc: function() {
                if (this.kEscUp) {
                    this.kEscUp = false;
                    if (this.gameRunning && this.inputAvailable) {
                        // Skip the word for user
                        getNextKeyWord();
                        this.wordInput = ''; // Remember to use vuejs .prevent for this event or the 'old' word will reappear
                        this.countSkipped++;
                        console.log('Grabbed new keyword')
                    }
                }
            },
            gameKUEsc: function() {
                this.kEscUp = true;
            },
        }

    });

    // ===== Model - Anagram Functions ===== \\

    function inputValidated(input) {

        // TODO: validate input (escape characters, etc.)

        return !(input == app.keyword
        || input == ''
        || input.split('').sort().join('') != app.keyword.split('').sort().join(''))
    }

    function isInputAnAnagram(input, keyword) {
        $.ajax({
            url: '/projects/anagram',
            type: 'POST',
            data: JSON.stringify({
                query: [input, keyword],
                multi: false,
                type: 1,
            }),
            contentType: 'application/json',
        })
        .done(function(res, status, jqXHR) {

            // Result will come in the form of a Boolean.
            processResult(input, res)
        })
        .fail(function(jqXHR, status, err) {
            console.log('Something went wrong with the POST request. Status: ' + status);
            app.inputAvailable = true; // Re-open input
        });
    }

    function processResult(input, result) {

        if (result) {

            // TODO: Feature: pop ALL anagram version of keyword as well
            app.keywordBank.splice(app.keywordBank.indexOf(app.keyword), 1);
            console.log('new wordBank length = ' + app.keywordBank.length);

            app.countCorrect++;
            flashInput(green);
            app.histBot = app.histMid;
            app.histMid = app.histTop;
            app.histTop = input;

            if (app.keywordBank.length <= 0) {
                endCurrentGame();
                console.log('wordBank runs out! Game ended!')
            } else {
                getNextKeyWord();
            }
        } else {
            flashInput(red);
            console.log('Incorrect anagram');
        }
        app.wordInput = '';
        app.inputAvailable = true; // Re-open input
    }

    function startNewGame(minL, maxL, curPage) {

        // Flush old word bank
        // Use either this or arr.splice(0, arr.length) for best performance.
        // arr = [] does not change the original array.
        app.keywordBank.length = 0;

        // Flush other stuff
        app.wordInput = '';

        // Get a new word bank for the client with given min and max word length (3 - 18)
        $.ajax({
        url: '/projects/anagram',
        type: 'POST',
        data: JSON.stringify({
            query: [minL, maxL],
            multi: false,
            type: 2,
        }),
        contentType: 'application/json',
        })
        .done(function(res, status, jqXHR) {

            // Result will come in the form of an array.
            app.keywordBank = res;
            console.log('word bank loaded');

            // Do nice transition
            transitPage(curPage, $('#page-game'), transSpeed, function() {
                $('#word-input').focus();
            });

            // Start the timer
            startTheTimer();
        })
        .fail(function(jqXHR, status, err) {
            console.log('Something went wrong with the POST request. Status: ' + status);
        });
    }

    function endCurrentGame() {
        // Process score


        // Do nice transition
        transitPage($('#page-game'), $('#page-end'), transSpeed, ()=>{
            // Process timer
            if (app.gameTimer.isActive()) {
                app.gameTimer.kill();
                console.log('killed .gameTimer');
            }
            $('#timer').css('width', '100%');
        });
    }

    function startTheTimer() {

        // TODO: countdown 3 - 2 - 1

        const $timer = $('#timer');
        app.gameTimer = TweenLite.to($timer, app.gameDuration, {width: '0%', ease:Linear.easeNone, onComplete: endCurrentGame});
        console.log('Timer started.');

        beginNewGame();
    }

    function beginNewGame() {
        app.countScore = 0; app.countCorrect = 0; app.countSkipped = 0; app.countTotal = 0;
        getNextKeyWord();
        app.gameRunning = true;
    }

    function transitPage(curPage, nxtPage, dur, f) {

        curPage.css('pointer-events', 'none'); // Disable user's clicks

        /* General logic:
        *  - nxtPage will always move to center
        *  - curPage will always move in the opposite direction of nxtPage */

        // Left - Right package

        let curPageDirection = '-100vw'; // Current page will move left
        if (!nxtPage.hasClass('pos-r')) { // Next page is on the left
            curPageDirection = '100vw'; // Current page will move right
            curPage.addClass('pos-r'); // Set current page position to right
        } else { // Next page is on the right
            // Current page will move left <-- no action needed as this is the default behaviour
            curPage.removeClass('pos-r');  // Set current page position to left
        }
        TweenLite.to(curPage, dur, {left: curPageDirection, opacity: 0});
        TweenLite.to(nxtPage, dur, {left: 0, opacity: '100', onComplete: animComplete});

        // nxtPage.show();
        nxtPage.css('display','block');

        function animComplete() {
            curPage.hide();
            curPage.css('pointer-events', 'auto'); // Re-enable user's clicks
            f();
        }
    }

    function getNextKeyWord() {
        app.keyword = app.keywordBank[Math.floor(Math.random() * (app.keywordBank.length + 1))];
        app.countTotal++;
    }

    function flashInput(color) {
        const $wordInput = $('#word-input');
        TweenLite.to($wordInput, .15, {backgroundColor: color});
        TweenLite.to($wordInput, .15, {backgroundColor: '#F5F5F5', delay: .15});
    }

    console.log('dom loaded');
});
