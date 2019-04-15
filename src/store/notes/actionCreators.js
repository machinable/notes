import * as types from './actionTypes.js';

export function setNote(noteId) {
    const action = {
        type: types.SET_CURRENT_NOTE,
        noteId: noteId
    }
    return action;
}

export function toggleEditNote(noteId) {
    const action = {
        type: types.TOGGLE_EDIT
    }
    return action;
}
