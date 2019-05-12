import * as types from './actionTypes.js'

const initialState = {
	notes: {},
	titles: [],
	noteId: undefined,
	editingNote: false,
	note: {}
}

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.UPDATE_NOTE_LIST:
			return Object.assign({}, state, {
				notes: action.notes,
				titles: action.titles
			});
		case types.SET_CURRENT_NOTE:
			return Object.assign({}, state, {
				noteId: action.noteId
			});
		case types.TOGGLE_EDIT:
			return Object.assign({}, state, {
				editingNote: !state.editingNote
			});
		default:
			return state;
	}
}

