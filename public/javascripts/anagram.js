$(document).ready(function() {

    // Random background color
    const bC1 = ['#90A4AE', '#78909C']; // Blue Grey 300, 400
    const bC2 = ['#A1887F', '#8D6E63']; // Brown 300, 400
    const bC3 = ['#FF8A65', '#FF7043']; // Deep Orange 300, 400
    const bC4 = ['#81C784', '#66BB6A']; // Green 300, 400
    const bC5 = ['#4DB6AC', '#26A69A']; // Teal 300, 400
    const bC6 = ['#7986CB', '#5C6BC0']; // Indigo 300, 400
    const bC7 = ['#e57373', '#ef5350']; // Red 300, 400

    const bkgColorPool = [bC1, bC2, bC3, bC4, bC5, bC6, bC7];
    let colorTheme = Math.floor(Math.random() * (bkgColorPool.length - 1));
    $('body').css('background-color', bkgColorPool[colorTheme][0]);
    $('header').css('background-color', bkgColorPool[colorTheme][1]);

    const red = '#e57373'; // Red 300
    const orange = '#FFB74D'; // Orange 300
    const green = '#AED581'; // Light Green 300

    let wordCardAnimRunning = false;

    // ===== App - Handled by vuejs ===== \\

    let app = new Vue({
        el: '#app',
        data: {
            multi: false,
            textInput: '',
            statusMsg: 'Alphabetical characters only. Maximum 50 characters.',
            resMsg: '',
            resultViewCard: true,
            kUEnter: true
        },
        watch: {
            textInput: function() {
                console.log('textInput changed.');
                if (this.textInput !== '') {
                    this.statusMsg = 'Press "enter" or "return" to solve.';
                } else {
                    this.statusMsg = 'Alphabetical characters only. Maximum 50 characters.';
                }
            }
        },
        methods: {

            // Key inputs: Enter
            inputKDEnter: function() {
                if (this.kUEnter) {
                    this.kUEnter = false;
                    initiateQuery(this.textInput.toLowerCase(), this.multi);
                }
            },
            inputKUEnter: function() {
                this.kUEnter = true
            },
        }
    });

    // ===== Model - Anagram Solving Logic ===== \\

    function initiateQuery(q, m) {
        if(q.length == 0) {
            app.statusMsg = 'Input must not be empty.';
            flashTextInput(red);
        } else {
            if (m) {
                // TODO: code for multi-word anagrams
            } else {
                app.statusMsg = 'Solving "' + q + '"...';
                app.textInput = '';
                requestAnagramFromServer(q);
            }
        }
    }

    function requestAnagramFromServer(q) {

        // A "proper" jQuery AJAX call is used (mainly to set contentType to 'application/json')
        // else all json data will be passed as string when it arrive at the server.
        $.ajax({
            url: '/search?q=' + q,
            type: 'GET',
            contentType: 'application/json',
        })
        .done(function(res, status, jqXHR) {

            // Result will come in the form of an Array.
            // We are converting (and processing) it to string for ease of use here.

            // First we need to clear all current word cards
            let $resultContainer = $('#result-container');
            $resultContainer.find('.word-card-container').remove();

            // Now we can add in new word cards
            if (res.length <= 0) {
                app.resMsg = 'No possible anagram found.';
            } else {
                app.resMsg = '';

                let resText = res.join(', ');

                for (let i = 0; i < res.length; i++) {
                    createWordCard(res[i], $resultContainer, .02 * i);
                }
                //TODO: uncomment after implementing text-card switch
                //app.resMsg = 'Anagram result for "' + q + '": ' + resText + '.';
            }
            flashTextInput(green);
        })
        .fail(function(jqXHR, status, err) {
            app.statusMsg = 'Something went wrong with the request. The server might be down. Status: ' + status;
            flashTextInput(orange);
        });
    }

    function flashTextInput(color) {
        const $textInput = $('#text-input');
        TweenLite.to($textInput, .15, {backgroundColor: color});
        TweenLite.to($textInput, .15, {backgroundColor: '#F5F5F5', delay: .15});
    }

    function createWordCard(word, location, delay) {
        let $newWordCardContainer = $("<div>", {
            class: 'word-card-container',
            text: word,
            });
        location.append($newWordCardContainer);
        let $newWordCard = $("<div>", {
            class: 'word-card',
            text: word,
            });
        $newWordCardContainer.append($newWordCard);
        wordCardEntrance($newWordCard, delay);
    }

    function wordCardEntrance(wordCard, delay) {
        TweenLite.to(wordCard, .15, {
            top: '0',
            opacity: '100',
            delay: delay
        });
    }
});