var userDatabase; // new database variable
var notesDatabase; // new database variable

var nodeCache = {}; // new node array

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
    notesDatabase = new Dexie("notesDatabase");
    notesDatabase.version(1).stores({
        notes: "++noteId, noteTitle, noteContent, noteColor, noteStatus"
    });
    refreshContent();
    // create references for the nodes that we have to work with
    ['noteTitle', 'noteContent', 'noteColor', 'noteStatus', 'notesContainer'].forEach(function (id) {
        nodeCache[id] = document.getElementById(id);
    });
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

function addItem() {
    // read data from inputs…
    var hasData;
    var data = {};
    ['noteTitle', 'noteContent', 'noteColor', 'noteStatus'].forEach(function (key) {
        var value = nodeCache[key].value.trim();
        if (value.length) {
            hasData = true;
            data[key] = value;
        }
    });

    if (!hasData) {
        return;
    }

    // …and store them away.
    notesDatabase.transaction('rw', notesDatabase.notes, function () {
        notesDatabase.notes.add(data);
        console.log('Woot! Did it');
    }).then(() => {
        refreshContent;
        clearForm;
    }).catch(function (e) {
        console.error(e.stack);
    });
}

function refreshContent() {
    return notesDatabase.notes.toArray()
        .then(renderAllNotes);
}

function renderAllNotes(data) {
    var content = '';
    data.forEach(function (item) {
        content += noteTemplate.card.replace(/\{([^\}]+)\}/g, function (_, key) {
            if (item[key] === undefined) {
                return ''; // return nothing if input is empty 
            } else {
                return item[key];
            }
        });
    });

    nodeCache['notesContainer'].innerHTML = noteTemplate.container.replace('{content}', content);

    $(".card").mouseenter(function () {
        $(this).find("#noteActionsButtons").fadeIn(200);
    }).mouseleave(function () {
        $(this).find("#noteActionsButtons").fadeOut(200);
    });
}

function clearForm() {
    ['noteTitle', 'noteContent', 'noteColor'].forEach(function (id) {
        nodeCache[id].value = '';
    });
}

function deleteItem(id) {
    notesDatabase.notes.where('noteId').equals(id).delete()
        .then(refreshContent);
}

var noteTemplate = {
    card: '<div id="noteId_{noteId}" class="card mb-3 {noteColor}">' +
        '<div class="card-body p-3">' +
        '<h5 class="card-title mb-0">{noteTitle}</h5>' +
        '<p class="card-text mb-0">{noteContent}</p>' +
        '<div id="noteActions">' +
        '<div id="noteActionsButtons">' +
        '<button type="button" class="btn {noteColor}"><i class="fa fa-pencil-alt"></i></button>' +
        '<button type="button" class="btn {noteColor}"><i class="fa fa-thumbtack"></i></button>' +
        '<button type="button" class="btn {noteColor}"><i class="fa fa-archive"></i></button>' +
        '<button type="button" class="btn {noteColor}" onclick="deleteItem({noteId})"><i class="fa fa-trash-alt"></i></button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
    container: '<div class="card-columns">{content}</div>'
};

// export some functions to the outside to
// make the onclick="" attributes work.
window.app = {
    addUser: addUser,
    addItem: addItem
};

// initialize app
initialize();