$(function () { //shorthand document.ready function
    // sidebar toggle
    $("#sidebar-toggle").click(function (e) {
        e.preventDefault();
        $("#content-section").toggleClass("toggled");
    });

    $('#new-note').on('submit', function (e) {
        e.preventDefault(); //prevent form from submitting
        app.addItem();
        $('#newNoteModal').modal('hide');
    });
});