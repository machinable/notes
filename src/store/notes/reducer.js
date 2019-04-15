import * as types from './actionTypes.js'

const initialState = {
	noteId: undefined,
	note: {}
}

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case types.SET_CURRENT_NOTE:
			return Object.assign({}, state, {
				noteId: action.noteId
			});
		default:
			return state;
	}
}

