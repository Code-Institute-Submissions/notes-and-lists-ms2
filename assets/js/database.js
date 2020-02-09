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
            //console.log("Database exists");
            $("#login-section").hide();
            $("#header-section").show();
            $("#content-section").show().addClass("d-flex");
        } else {
            //console.log("Database doesn't exist");
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
        notes: "++noteId, noteTitle, noteContent, noteColor, noteCreated, noteUpdated, [notePinned+noteStatus]"
    });
    refreshPinnedContent();
    refreshContent();
    // create references for the nodes that we have to work with
    ['noteTitle', 'noteContent', 'noteColor', 'pinnedItemsContainer', 'itemsContainer'].forEach(function (id) {
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
    var data = {
        noteTitle: document.getElementById('noteTitle').value.trim(),
        noteContent: document.getElementById('noteContent').value.trim(),
        noteColor: document.getElementById('noteColor').value.trim(),
        noteCreated: Date.now(),
        noteUpdated: '',
        noteStatus: 1,
        notePinned: 0
    };

    // …and store them away.
    notesDatabase.transaction('rw', notesDatabase.notes, function () {
        notesDatabase.notes.add(data);
        console.log('Woot! Did it');
    }).then(() => {
        refreshContent();
        clearForm();
    }).catch(function (e) {
        console.error(e.stack);
    });
}

function refreshContent() {
    return notesDatabase.notes.where({
        noteStatus: 1,
        notePinned: 0
    }).toArray().then(function (data) {
        (renderItems(data, false));
    });
}

function refreshPinnedContent() {
    return notesDatabase.notes.where({
        noteStatus: 1,
        notePinned: 1
    }).toArray().then(function (data) {
        (renderItems(data, true));
    });
}

function renderItems(data, pinned) {
    var content = '';
    data.forEach(function (item) {
        content += noteTemplate.card.replace(/\{([^\}]+)\}/g, function (_, key) {
            if (pinned) {
                $('#pinButton_' + item['noteId']).prop('title', 'Pin note');
            } else {
                console.log(item['noteId']);
                $('#pinButton_' + item['noteId']).prop('title', 'Unpin note');
            }
        
            if (item[key] === undefined) {
                return ''; // return nothing if input is empty 
            } else {
                return escapeHtml(item[key]);
            }
        });
    });

    if (pinned) {
        nodeCache['pinnedItemsContainer'].innerHTML = noteTemplate.container.replace('{content}', content);
    } else {
        nodeCache['itemsContainer'].innerHTML = noteTemplate.container.replace('{content}', content);
    }

    // Enable bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $(".card").mouseenter(function () {
        $(this).find("#noteActionsButtons").fadeIn(200);
    }).mouseleave(function () {
        $(this).find("#noteActionsButtons").fadeOut(200);
    });
}

function clearForm() {
    ['noteTitle', 'noteContent'].forEach(function (id) {
        nodeCache[id].value = '';
    });
}

function pinItem(id) {
    notesDatabase.notes.get(id).then(function (item) {
        notesDatabase.notes.update(id, {
            notePinned: (item.notePinned == 1) ? 0 : 1,
        }).then(function () {
            refreshPinnedContent();
            refreshContent();
        });
    });
}

// get pin button tooltip title based on pin status
function pinButtonTitle(id) {
    notesDatabase.notes.get(id).then(function (item) {
        notesDatabase.notes.update(id, {
            notePinned: (item.notePinned == 1) ? 0 : 1,
        }).then(function () {
            refreshPinnedContent();
            refreshContent();
        });
    });
}

// delete item
function deleteItem(id) {
    notesDatabase.notes.where('noteId').equals(id).delete()
        .then(function () {
            refreshPinnedContent();
            refreshContent();
        });
}

// items template
var noteTemplate = {
    card: '<div id="noteId_{noteId}" class="card mb-3 {noteColor}">' +
        '<div class="card-body p-3">' +
        '<h5 class="card-title mb-0">{noteTitle}</h5>' +
        '<p class="card-text mb-0">{noteContent}</p>' +
        '<div id="noteActions">' +
        '<div id="noteActionsButtons">' +
        '<button type="button" class="btn {noteColor}" data-toggle="tooltip" title="Edit note"><i class="fa fa-pencil-alt"></i></button>' +
        '<button type="button" class="btn {noteColor}" data-toggle="tooltip" title="Pin note" onclick="pinItem({noteId}) id="pinButton_{noteId}"><i class="fa fa-thumbtack"></i></button>' +
        '<button type="button" class="btn {noteColor}" data-toggle="tooltip" title="Archive note"><i class="fa fa-archive"></i></button>' +
        '<button type="button" class="btn {noteColor}" data-toggle="tooltip" title="Delete note" onclick="deleteItem({noteId})"><i class="fa fa-trash-alt"></i></button>' +
        '</div>' +
        '</div>' +
        '<small class="font-weight-light font-italic">{noteCreated}</small>' +
        '</div>' +
        '</div>',
    container: '<div class="card-columns">{content}</div>'
};

// escapeHtml function from: https://stackoverflow.com/a/12034334/4007492
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

// export some functions to the outside to
// make the onclick="" attributes work.
window.app = {
    addUser: addUser,
    addItem: addItem
};

// initialize app
initialize();