import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactMarkdown from 'react-markdown';
import client from '../../apiclient/';

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
      loading: true
    };
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
    client.notes().get(this.props.noteId, this.recieveNote, this.err)
  }

  componentDidUpdate = (prevProps) => {
		var newId = this.props.noteId;
		var oldId = prevProps.noteId;
		
		if (newId !== oldId) {
      this.setState({loading: true}, this.getNote);
		}
	}

  componentDidMount = () => {
    if(this.props.noteId) {
      this.getNote();
    }
  }

  render = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
          <Paper className={classes.paper}>
              <div className={classes.contentWrapper}>
                  <Typography color="textSecondary" align="center">
                      {this.props.noteId && this.state.loading && <CircularProgress />}
                      {!this.props.noteId && "Select or create a new note"}
                  </Typography>
                  <Typography>
                  {this.state.note && <ReactMarkdown source={this.state.note.content} />}
                  </Typography>
              </div>
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
		noteId: state.noteId
	};
}

export default withStyles(styles)(connect(mapStateToProps)(Content));
