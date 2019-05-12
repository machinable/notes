import * as types from './actionTypes.js';

export function removeNote(noteId) {
    const action = {
        type: types.REMOVE_NOTE,
        noteId: noteId
    };
    return action;
}

export function setNotes(notes) {
    var noteObj = {};
    var titles = [];
    for(let i = 0; i < notes.length; i++) {
        noteObj[notes[i].id] = notes[i];
        titles.push(notes[i].name);
    }
    console.log(notes);
    console.log(titles);
    const action = {
        type: types.UPDATE_NOTE_LIST,
        notes: noteObj,
        titles: titles
    };
    return action;
}

export function setNote(noteId) {
    const action = {
        type: types.SET_CURRENT_NOTE,
        noteId: noteId
    };
    return action;
}

export function toggleEditNote(noteId) {
    const action = {
        type: types.TOGGLE_EDIT
    };
    return action;
}
