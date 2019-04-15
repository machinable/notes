import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import client from '../../apiclient/';

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

class Content extends Component {
  constructor(props){
    super(props);

    this.state = {
      note: undefined,
      loading: true,
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

  render = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
          <Paper className={classes.paper}>
              <Typography align="center">
                {this.props.noteId && this.state.loading && <CircularProgress />}
              </Typography>

              {!this.props.editingNote &&
              <div className={classes.contentWrapper}>
                  <Typography color="textSecondary" align="center">
                      {!this.props.noteId && "Select or create a new note"}
                  </Typography>

                  {this.state.note && !this.props.editingNote && 
                    <Typography>
                      <div className="override-mde-preview mde-preview">
                        <div className="mde-preview-content">
                          <div dangerouslySetInnerHTML={{__html: this.converter.makeHtml(this.state.note.content)}} />
                        </div>
                      </div>
                    </Typography>
                  }
              </div>}
              {this.state.note && this.props.editingNote && 
                  <Typography>
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
    editingNote: state.editingNote
	};
}

export default withStyles(styles)(connect(mapStateToProps)(Content));
