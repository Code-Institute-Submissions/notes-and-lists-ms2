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

### Skeleton

[Landing wireframe](https://github.com/onisstudio/notes-and-lists-ms2/blob/master/wireframes/landing.png)
[Landing mobile wireframe](https://github.com/onisstudio/notes-and-lists-ms2/blob/master/wireframes/landing%20(mobile%20landing).png)

[Login wireframe](https://github.com/onisstudio/notes-and-lists-ms2/blob/master/wireframes/login%20page.png)
[Login mobile wireframe](https://github.com/onisstudio/notes-and-lists-ms2/blob/master/wireframes/login%20page%20(mobile%20login).png)

[New item form wireframe](https://github.com/onisstudio/notes-and-lists-ms2/blob/master/wireframes/new%20item%20form.png)

### Surface

The color scheme offers a white background with a brick-style effect and a gray navbar. The notes that can be added by users can be different colors and depending on note color, the text color will be black or white.

## Technologies

1. HTML
2. CSS
3. Bootstrap (v4.4.1)
4. Javascript and jQuery (v3.4.1)
5. [Dexie.js](https://dexie.org/) - A Minimalistic Wrapper for IndexedDB

## Features

The app allows users to add notes with a title, content and color. Users can pin important notes, which will show on top of all the other notes. Notes can also be edited, archived and deleted. Archived notes will go on a separate page and can be accesed at a later time, they also can be unarchived. When deleting a note a confirmation modal will be shown to the user. Logging out will delete all the notes and the user will have to log in again.

### Future plans

The main feature that is required is to make Internet Explorer compatible with indexeddb API (using IndexedDBShim).
Some other features include:

- multiple users
- add images/videos to the notes
- categorize notes with a label
- add notifications to user after action is done
- drag and drop features
- instead of delete confirmation add "Undo" option, add "Bin" page
- add toasts for notifications
- add notes reminders

## Testing

The app was tested on all major browsers, all of them working except Internet Explorer because of partial support for indexeddb. I decided to just show a message to Internet Explorer users that at the moment we are only supporting modern browsers. As a future plan, IndexedDBShim can be used to add support for Internet Explorer.

While testing if all the functions are working, my mentor found one error on logout function, which was fixed. Also on same testing I realized that when an item is updated the created date is showing, changed to show the updated date.

Tested notes with very long title and very long content and the output was not very good, limited the number of characters for the title and added overflow for the item content and now it looks much better.

Tested HTML, CSS and JS for validation. All errors found were fixed.

## Deployment

The site is hosted on GitHub, deployed from the master branch. The deployed site will update automatically upon new commits to the master branch.

To run locally, you can clone this repository directly into the editor of your choice by pasting git clone <https://github.com/onisstudio/notes-and-lists-ms2.git> into your terminal. To cut ties with this GitHub repository, type git remote rm origin into the terminal.

## Credits

### Media

The photo used on the login page was obtained from [Pexels](https://www.pexels.com/).

### Acknowledgements

Got inspired from Google Keep note taking app.

## To Do

- [x] Add demo link
- [x] Add UX:
  - [x] user stories
  - [x] strategy
  - [x] scope
  - [x] structure
  - [x] skeleton
  - [x] surface
- [x] Technologies
- [x] Features
- [ ] Testing
- [x] Deployment
- [ ] Credits:
  - [ ] content
  - [x] media
  - [x] acknowledgements
