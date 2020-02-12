var userDatabase; // new database variable
var notesDatabase; // new database variable

var nodeCache = {}; // new node array for page elements

function initialize() {
    // Define user database
    userDatabase = new Dexie('userDatabase');
    userDatabase.version(1).stores({
        user: '++id, name'
    });

    // check if user database exists
    // if true, we already have the user, hide the login section
    // if false, we need an user, show the login section
    Dexie.exists('userDatabase').then(function (exists) {
        if (exists) {
            //console.log('Database exists');
            $('#login-section').hide();
            $('#header-section').show();
            $('#content-section').show().addClass('d-flex');
            renderUsername();
        } else {
            //console.log('Database doesn't exist');
            $('#login-section').show();
            $('#header-section').hide();
            $('#content-section').hide().removeClass('d-flex');
        }
    }).catch(function (error) {
        console.error('Oops, an error occurred when trying to check database existance');
    });

    // Define notes database
    notesDatabase = new Dexie('notesDatabase');
    notesDatabase.version(1).stores({
        notes: '++noteId, noteTitle, noteContent, noteColor, noteCreated, noteUpdated, [notePinned+noteStatus]'
    });
    refreshPinnedContent();
    refreshContent();
    refreshArchivedContent();
    // create references for the nodes that we have to work with
    ['noteTitle', 'noteContent', 'noteColor', 'pinnedItemsContainer', 'itemsContainer', 'archivedItemsContainer', 'deleteModalContainer'].forEach(function (id) {
        nodeCache[id] = document.getElementById(id);
    });

    $('#archivedItemsHeader').hide();
    $('#archivedItemsContainer').hide();
}

// add user in the database
// we can hide the login section and show content after that
function addUser() {
    var username = document.getElementById('userName').value.trim();

    userDatabase.transaction('rw', userDatabase.user, function () {
        userDatabase.user.add({
            name: username
        });
        //console.log('Woot! Did it');
        $('#login-section').hide();
        $('#header-section').show();
        $('#content-section').show().addClass('d-flex');
    }).catch(function (e) {
        console.error(e.stack);
    });
}

// add item to database
// create a data array for all the data from inputs the store it in the database
// after data is added we can refresh content and clear the form so we can add more items
function addItem() {
    // read data from inputs…
    var today = new Date();
    var data = {
        noteTitle: document.getElementById('noteTitle').value.trim(),
        noteContent: document.getElementById('noteContent').value.trim(),
        noteColor: document.getElementById('noteColor').value.trim(),
        noteCreated: today.toShortFormat(),
        noteUpdated: '',
        noteStatus: 1,
        notePinned: 0
    };

    // …and store them away.
    notesDatabase.transaction('rw', notesDatabase.notes, function () {
        notesDatabase.notes.add(data);
        //console.log('Woot! Did it');
    }).then(() => {
        refreshContent();
        clearForm();
    }).catch(function (e) {
        console.error(e.stack);
    });
}

// get items that are not pinned
// on success render items
function refreshContent() {
    notesDatabase.notes.where({
        noteStatus: 1,
        notePinned: 0
    }).count().then(function (data) {
        // if we are on the archive page, do not show the pinned or all items headers
        (data > 0 && $('#archivedItemsHeader').is(":hidden")) ? $('#itemsHeader').show(): $('#itemsHeader').hide();
    });
    return notesDatabase.notes.where({
        noteStatus: 1,
        notePinned: 0
    }).toArray().then(function (data) {
        (renderItems(data, false, false));
    });
}

// get pinned items
// on success render items
function refreshPinnedContent() {
    notesDatabase.notes.where({
        noteStatus: 1,
        notePinned: 1
    }).count().then(function (data) {
        // if we are on the archive page, do not show the pinned or all items headers
        (data > 0 && $('#archivedItemsHeader').is(":hidden")) ? $('#pinnedItemsHeader').show(): $('#pinnedItemsHeader').hide();
    });
    return notesDatabase.notes.where({
        noteStatus: 1,
        notePinned: 1
    }).toArray().then(function (data) {
        (renderItems(data, true, false));
    });
}

// get archived items
// on success render items
function refreshArchivedContent() {
    notesDatabase.notes.where({
        noteStatus: 2,
        notePinned: 0
    }).count().then(function (data) {
        //(data > 0) ? $('#archivedItemsHeader').show(): $('#archivedItemsHeader').hide();
    });
    return notesDatabase.notes.where({
        noteStatus: 2,
        notePinned: 0
    }).toArray().then(function (data) {
        (renderItems(data, false, true));
    });
}

function renderItems(data, pinned, archived) {
    var content = '';
    data.forEach(function (item) {
        content += template.card.replace(/\{([^\}]+)\}/g, function (_, key) {
            if (item[key] === undefined) {
                return ''; // return nothing if input is empty 
            } else {
                return escapeHtml(item[key]);
            }
        });
    });

    if (pinned) {
        nodeCache['pinnedItemsContainer'].innerHTML = template.container.replace('{content}', content);
        $('#pinnedItemsContainer .pinButton').prop('title', 'Unpin note');
    } else if (archived) {
        nodeCache['archivedItemsContainer'].innerHTML = template.container.replace('{content}', content);
        $('#archivedItemsContainer .archiveButton').prop('title', 'Unarchive note');
    } else {
        nodeCache['itemsContainer'].innerHTML = template.container.replace('{content}', content);
        $('#itemsContainer .pinButton').prop('title', 'Pin note');
        $('#itemsContainer .archiveButton').prop('title', 'Archive note');
    }

    // Enable bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $('.card').mouseenter(function () {
        $(this).find('#noteActionsButtons').fadeIn(200);
    }).mouseleave(function () {
        $(this).find('#noteActionsButtons').fadeOut(200);
    });
}

function renderUsername() {
    userDatabase.user.get(1).then(function (data) {
        $('#renderUsername').text(data.name);
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
            noteStatus: 1,
            notePinned: (item.notePinned == 1) ? 0 : 1,
        }).then(function () {
            $('[data-toggle="tooltip"]').tooltip('dispose'); // dispose button tooltip as it remains there after click
            refreshPinnedContent();
            refreshContent();
            refreshArchivedContent();
        });
    });
}

function archiveItem(id) {
    notesDatabase.notes.get(id).then(function (item) {
        notesDatabase.notes.update(id, {
            noteStatus: (item.noteStatus == 1) ? 2 : 1,
            notePinned: 0
        }).then(function () {
            $('[data-toggle="tooltip"]').tooltip('dispose'); // dispose button tooltip as it remains there after click
            refreshPinnedContent();
            refreshContent();
            refreshArchivedContent();
        });
    });
}

// delete item modal, get confirmation before delete
function deleteItemModal(id) {
    nodeCache['deleteModalContainer'].innerHTML = template.deleteItemModal.replace(/{noteId}/g, id);
    $('#deleteItemModal_' + id).modal();
}

// delete item
function deleteItem(id) {
    console.log('modal?')
    notesDatabase.notes.where('noteId').equals(id).delete()
        .then(function () {
            $('[data-toggle="tooltip"]').tooltip('dispose'); // dispose button tooltip as it remains there after click
            refreshPinnedContent();
            refreshContent();
            refreshArchivedContent();
        });
}

// items template
var template = {
    card: '<div id="noteId_{noteId}" class="card mb-3 {noteColor}">' +
        '<div class="card-body p-3">' +
        '<h5 class="card-title mb-0">{noteTitle}</h5>' +
        '<p class="card-text mb-0">{noteContent}</p>' +
        '<div id="noteActions">' +
        '<div id="noteActionsButtons">' +
        '<button type="button" class="btn {noteColor}" data-toggle="tooltip" title="Edit note"><i class="fa fa-pencil-alt"></i></button>' +
        '<button type="button" class="btn {noteColor} pinButton" data-toggle="tooltip" title="" onclick="pinItem({noteId})"><i class="fa fa-thumbtack"></i></button>' +
        '<button type="button" class="btn {noteColor} archiveButton" data-toggle="tooltip" title="Archive note" onclick="archiveItem({noteId})"><i class="fa fa-archive"></i></button>' +
        '<button type="button" class="btn {noteColor}" data-toggle="tooltip" title="Delete note" onclick="deleteItemModal({noteId})"><i class="fa fa-trash-alt"></i></button>' +
        '</div>' +
        '</div>' +
        '<small class="float-right mb-2 font-weight-light font-italic">Created: {noteCreated}</small>' +
        '</div>' +
        '</div>',
    container: '<div class="card-columns">{content}</div>',
    deleteItemModal: '<div class="modal fade" id="deleteItemModal_{noteId}" tabindex="-1" role="dialog" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-body">' +
        '<p class="text-center">This will permanently delete the item.</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancel</button>' +
        '<button type="submit" class="btn btn-sm btn-primary" data-dismiss="modal" onclick="deleteItem({noteId})">Delete</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
};

function viewAll() {
    $('#pinnedItemsHeader').show();
    $('#pinnedItemsContainer').show();
    $('#itemsHeader').show();
    $('#itemsContainer').show();
    $('#archivedItemsHeader').hide();
    $('#archivedItemsContainer').hide();
    refreshPinnedContent();
    refreshContent();
}

function viewArchived() {
    $('#pinnedItemsHeader').hide();
    $('#pinnedItemsContainer').hide();
    $('#itemsHeader').hide();
    $('#itemsContainer').hide();
    $('#archivedItemsHeader').show();
    $('#archivedItemsContainer').show();
    refreshArchivedContent();
}

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


// get current date in DD-Mon-YYY format from: https://stackoverflow.com/a/27480352/4007492
Date.prototype.toShortFormat = function () {
    var month_names = ['Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
    ];

    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();

    return day + ' ' + month_names[month_index] + ' ' + year;
}

// export some functions to the outside to
// make the onclick='' attributes work.
window.app = {
    addUser: addUser,
    addItem: addItem,
    viewAll: viewAll,
    viewArchived: viewArchived
};

// initialize app
initialize();