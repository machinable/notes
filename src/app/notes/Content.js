import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import Tooltip from '@material-ui/core/Tooltip';
import client from '../../apiclient/';
import {setNotes, removeNote} from '../../store/notes/actionCreators';

import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const styles = theme => ({
  paper: {
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing.unit,
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

const noteTitle = /^(?:#)\s*(.+?)[ \t]*$/gm;

class Content extends Component {
  constructor(props){
    super(props);

    this.state = {
      note: undefined,
      loading: true,
      edit: false,
      tab: "write"
    };

    this.converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });
  }

  err = (response) => {
    console.log("error --");
    console.log(response);
    this.setState({loading: false});
  }

  recieveNote = (response) => {
    this.setState({note: response.data, loading: false});
  }

  getNote = () => {
    var c = this;
    setTimeout(function(){
      client.notes().get(c.props.noteId, c.recieveNote, c.err);
    }, 250);
  }

  componentDidUpdate = (prevProps) => {
		var newId = this.props.noteId;
		var oldId = prevProps.noteId;
		
		if (newId !== oldId) {
      this.setState({loading: true, note: undefined}, this.getNote);
    }
	}

  componentDidMount = () => {
    if(this.props.noteId) {
      this.getNote();
    }
  }

  handleValueChange = (value) => {
    var note = this.state.note;
    note.content = value;
    this.setState({
      note: note
    });
  };

  handleTabChange = (tab) => {
    this.setState({tab})
  };

  toggleEdit = () => {
    this.setState({edit: !this.state.edit});
  }

  saveNote = () => {
    // save note
    var wasThis = this;
    var titles = noteTitle.exec(this.state.note.content);
    var title = "Create a header for title";
    
    if (titles && titles.length > 0) {
      title = titles[0].replace(/# /g, '').replace(/#/g, '');
    }

    var updatedNote = this.state.note
    updatedNote.name = title
    var newNotesList = this.props.notes;
    newNotesList[this.state.note.id] = updatedNote;

    client.notes().update(
      this.state.note.id, 
      {content: this.state.note.content, name: title}, 
      function(){
        wasThis.setState({edit: !wasThis.state.edit});
		    wasThis.props.dispatch(setNotes(Object.values(newNotesList)));
      }, 
      function(){});
  }

  deleteNote = () => {
    // delete note
    client.notes().deleteNote(
      this.state.note.id,
      this.refreshList,
      function(response){console.log("error"); console.log(response);}
    );
  }

  refreshList = () => {
    const history = this.props.history;
    var newNotesList = this.props.notes;
    delete newNotesList[this.state.note.id];
    
    this.props.dispatch(setNotes(Object.values(newNotesList)));
    history.push('/');
  }

  render = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
          <Paper className={classes.paper}>
              <div className="note-header" >
              {this.props.noteId && this.state.loading && 
              <Typography component={'span'} align="center">
                  <CircularProgress />
              </Typography>
              }
              {this.props.noteId && !this.state.loading && 
              <Grid container spacing={8} alignItems="center">

                {!this.state.edit &&
                  <Grid item>
                    <Tooltip title="Edit this note">
                      <IconButton color="primary" onClick={this.toggleEdit}>
                        <CreateIcon className={classes.create} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                }

                {this.state.edit &&
                  <Grid item>
                    <Tooltip title="Save change to note">
                      <IconButton color="primary" onClick={this.saveNote}>
                        <SaveIcon className={classes.create} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                }

                <Grid item>
                  <Tooltip title="Delete this note">
                    <IconButton color="secondary" onClick={this.deleteNote}>
                      <DeleteIcon className={classes.delete} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              }
              </div>

              {!this.state.edit &&
              <div className={classes.contentWrapper}>
                  <Typography color="textSecondary" align="center">
                      {!this.props.noteId && "Select or create a new note"}
                  </Typography>

                  {this.state.note && !this.state.edit && 
                    <Typography component={'span'}>
                      <div className="override-mde-preview mde-preview">
                        <div className="mde-preview-content">
                          <div dangerouslySetInnerHTML={{__html: this.converter.makeHtml(this.state.note.content)}} />
                        </div>
                      </div>
                    </Typography>
                  }
              </div>}
              {this.state.note && this.state.edit && 
                  <Typography component={'span'}>
                    <ReactMde
                      onChange={this.handleValueChange}
                      onTabChange={this.handleTabChange}
                      value={this.state.note.content}
                      generateMarkdownPreview={markdown =>
                          Promise.resolve(this.converter.makeHtml(markdown))}
                      selectedTab={this.state.tab}
                    />
                  </Typography>
                  }
          </Paper>
      </React.Fragment>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

// redux
function mapStateToProps(state) {
	return {
    noteId: state.noteId,
    editingNote: state.editingNote,
    notes: state.notes
	};
}

export default withStyles(styles)(connect(mapStateToProps)(Content));
