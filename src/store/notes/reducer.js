import * as types from './actionTypes.js'

const initialState = {
	noteId: undefined,
	editingNote: false,
	note: {}
}

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
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

