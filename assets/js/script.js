$(function () { //shorthand document.ready function
    /* sidebar toggle */
    $("#sidebar-toggle").click(function (e) {
        e.preventDefault();
        $("#content-section").toggleClass("toggled");
    });
});