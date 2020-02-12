$(function () { //shorthand document.ready function
    // sidebar toggle
    $("#sidebar-toggle").click(function (e) {
        e.preventDefault();
        $("#content-section").toggleClass("toggled");
    });

    $('#loginForm').on('submit', function (e) {
        e.preventDefault(); //prevent form from submitting
        app.addUser();
    });

    $('#newItemForm').on('submit', function (e) {
        e.preventDefault(); //prevent form from submitting
        app.addItem();
        $('#newNoteModal').modal('hide');
    });
});