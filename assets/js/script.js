$(function () { //shorthand document.ready function
    /*
     * if browser is ie, show an info message
     */
    if (window.document.documentMode) {
        $('#login-section').hide();
        $('#header-section').hide();
        $('#content-section').hide();
        // do IE stuff
        let unsupportedBrowser = document.getElementById('unsupported-browser');
        unsupportedBrowser.innerHTML = '<p><b>The browser you are using is not supported.</b><br>Some critical features are not available for your browser version. We only support the recent versions of major browsers like Chrome, Firefox, Safari, and Edge at the moment.</p>';
        unsupportedBrowser.style.display = 'block';
    } else {
        // initialize app
        initialize();
    }

    // sidebar toggle
    $("#sidebar-toggle").click(function (e) {
        e.preventDefault();
        $("#content-section").toggleClass("toggled");
    });

    $('#loginForm').on('submit', function (e) {
        e.preventDefault(); //prevent form from submitting
        addUser();
    });

    $('#newItemForm').on('submit', function (e) {
        e.preventDefault(); //prevent form from submitting
        addItem();
        $('#newNoteModal').modal('hide');
    });

    /*
     * item title too long, this will limit the title to 60 characters
     */
    var maxLength = 60;
    $('input').on('keyup', function () {
        var characters = maxLength - $(this).val().length;
        $('#remainingCharacters').text(characters);
    });
});