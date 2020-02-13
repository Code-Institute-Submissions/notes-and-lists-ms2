# Notes and Lists

Interactive Frontend Development Milestone Project | Notes and Lists

## Demo

A live demo can be found [here](https://onisstudio.github.io/notes-and-lists-ms2/).

## UX

### User Stories

As a first time user you can input a new name and start adding new notes, you can select note color, pin notes, archive notes and delete them. All added notes will be stored on the browser`s database until they are deleted or user logs out.

### Strategy

My goal was to create an user-friendly application where users can easily add notes, pin important notes and also choose a note background color.

### Scope

The scope of the application is for users to easily add new notes, pin important notes and categorize them by colors.

### Structure

The application is a one page app which has a login page for first time users, after login the users have a top navbar, a collapsible sidebar and the main content. To a add a new note a modal will show with all the inputs, title is optional and content is required. All notes have and edit, pin, archive and delete option.

## Technologies

1. HTML
2. CSS
3. Bootstrap (v4.4.1)
4. Javascript and jQuery (v3.4.1)
5. [Dexie.js](https://dexie.org/) - A Minimalistic Wrapper for IndexedDB

## Features

The app allows users to add notes with a title, content and color. Users can pin important notes, which will show on top of all the other notes. Notes can also be edited, archived and deleted. Archived notes will go on a separate page and can be accesed at a later time, they also can be unarchived. When deleting a note a confirmation modal will be shown to the user. Logging out will delete all the notes and the user will have to log in again.

### Future plans

The main feature that is required is to make Internet Explorer compatible with indexeddb API (using IndexedDBShim). Some other features include adding images/videos to the notes, categorize notes with a label, drag and drop features, instead of delete confirmation add "Undo" option, add toasts for notifications and also add notes reminders.

## Testing

## Deployment

The site is hosted on GitHub, deployed from the master branch. The deployed site will update automatically upon new commits to the master branch.

To run locally, you can clone this repository directly into the editor of your choice by pasting git clone <https://github.com/onisstudio/notes-and-lists-ms2.git> into your terminal. To cut ties with this GitHub repository, type git remote rm origin into the terminal.

## Credits

### Media

The photo used on the login page was obtained from [Pexels](https://www.pexels.com/).

## To Do

- [x] Add demo link
- [ ] Add UX:
  - [x] user stories
  - [x] strategy
  - [x] scope
  - [x] structure
  - [ ] skeleton
  - [ ] surface
- [x] Technologies
- [x] Features
- [ ] Testing
- [x] Deployment
- [ ] Credits:
  - [ ] content
  - [x] media
  - [ ] acknowledgements
