$(document).ready(function() {

    // ===== View Model - Handled by vuejs ===== \\

    let app = new Vue({
        el: '#anagram-app',
        data: {
            queryMsg: '',
            resultMsg: 'Phrase to be solved:',
            multiAng: false,
        },
        methods: {
            // Run on clicking the query input box
            qIClicked: function(e) {
                let $e = $(e.currentTarget);
                // Either select everything in the input form, or delete everything, or use a HTML form placeholder.
                // $e.select();
                // this.queryMsg = '';
                // console.log($e.attr('id') + 'clicked')
            },

            // Run after the query is successfully submitted.
            queryAnagram: function(e) {
                let q = this.queryMsg;
                if(this.queryMsg.length == 0) {
                    this.resultMsg = 'Make sure the input field is not empty!'
                } else {
                    if (this.multiAng) {

                        // TODO: code for multi-word anagrams
                    } else {
                        this.resultMsg = 'Solving "' + this.queryMsg + '" (single-word anagram)...'; // Loading text...
                        this.queryMsg = ''; // Clear text in query box

                        // The second part of the anagram solver.
                        solveSingleAng(q);
                    }
                }
            },
        }
    });

    // ===== Model - Anagram Solving Logic ===== \\

    function solveSingleAng(q) {

        // A "proper" jQuery POST call is used (mainly to set contentType to 'application/json')
        // else all json data will be passed as string when it arrive at the server.
        $.ajax({
            url: '/projects/anagram',
            type: 'POST',
            data: JSON.stringify({
                query: q,
                multi: false,
                type: 0,
                aData: ''
            }),
            contentType: 'application/json',
        })
        .done(function(res, status, jqXHR) {

            // Result will come in the form of an Array.
            // We are converting (and processing) it to string for ease of use here.
            let result = res.join(', ');

            if (result == '') {
                app.resultMsg = 'No possible anagram found.';
            } else {
                app.resultMsg = 'Anagram result: ' + result;
            }
        })
        .fail(function(jqXHR, status, err) {
            app.resultMsg = 'Something went wrong with the POST request. Status: ' + status;
        });
    }
});