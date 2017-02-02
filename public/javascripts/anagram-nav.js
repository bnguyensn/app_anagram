$(document).ready(function() {

    // === NAVIGATION MENU === //

    let $multiEnabledBtnContainer = $('#multi-enabled-btn-container');
    let $multiEnabledBtn = $('#multi-enabled-btn');
    let $multiEnabledBtnFalse = $('#multi-enabled-btn-false');
    let multiEnabled = false;

    $multiEnabledBtnContainer.click(function(e) {
        // Due to event bubbling, the menu would close immediately after the user clicks the menu button
        // The below prevents this from happening
        e.stopPropagation();

        if (multiEnabled) {
            $multiEnabledBtn.hide();
            $multiEnabledBtnFalse.show();
        } else {
            $multiEnabledBtnFalse.hide();
            $multiEnabledBtn.show();
        }
        multiEnabled = !multiEnabled;
    });
});