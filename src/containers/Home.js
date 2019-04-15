import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notes from '../app/notes/Notes';

import {setNote} from '../store/notes/actionCreators';

class Home extends Component {
	componentDidUpdate = (prevProps) => {
		var newId = this.props.match.params.noteId;
		var oldId = prevProps.match.params.noteId;
		
		console.log(newId);
		console.log(oldId);

		if (newId !== oldId) {
			this.props.dispatch(setNote(newId));
		}
	}

  	componentWillMount = () => {
		this.props.dispatch(setNote(this.props.match.params.noteId));
  	}

	render() {
		return (
			<Notes history={this.props.history}/>
		  );
	}
}

export default connect()(Home);
