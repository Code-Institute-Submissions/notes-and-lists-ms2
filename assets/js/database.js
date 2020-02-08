var userDatabase;
var notesDatabase;

function initialize() {
    // Define user database
    userDatabase = new Dexie("userDatabase");
    userDatabase.version(1).stores({
        user: "name"
    });

    Dexie.exists("userDatabase").then(function (exists) {
        if (exists) {
            console.log("Database exists");
            $("#login-section").hide();
            $("#header-section").show();
            $("#content-section").show().addClass("d-flex");
        } else {
            console.log("Database doesn't exist");
            $("#login-section").show();
            $("#header-section").hide();
            $("#content-section").hide().removeClass("d-flex");
        }
    }).catch(function (error) {
        console.error("Oops, an error occurred when trying to check database existance");
    });

    // Define notes database
    //
    /*var notesDatabase = new Dexie("notesDatabase");
    notesDatabase.version(1).stores({
        notes: "++noteId, noteTitle, noteContent, noteColor, noteStatus"
    });*/
}

function addUser() {
    var username = document.getElementById("userName").value.trim();

    userDatabase.transaction('rw', userDatabase.user, function () {
        userDatabase.user.add({
            name: username
        });
        console.log('Woot! Did it');
        $("#login-section").hide();
        $("#header-section").show();
        $("#content-section").show().addClass("d-flex");
    }).catch(function (e) {
        console.error(e.stack);
    });
}

// export some functions to the outside to
// make the onclick="" attributes work.
window.app = {
    addUser: addUser
};

// initialize app
initialize();