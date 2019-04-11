import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';

import client from '../../apiclient/';

const styles = theme => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Navigator extends Component {
  constructor(props){
    super(props);

    this.state = {
      notes: [],
      activeNote: ""
    };
  }

  newNote = () => {
    var noteTitle = new Date().toISOString() + " Note";
    client.notes().create({name: noteTitle, content: "# " + noteTitle + "\n"}, this.listNotes, this.err)
  }

  err = (response) => {
    console.log("error --");
    console.log(response);
  }

  recieveNotes = (response) => {
    console.log(response);
    this.setState({notes: response.data.items});
  }

  listNotes = () => {
    client.notes().list(this.recieveNotes, this.err)
  }

  componentWillMount = () => {
    this.listNotes();
  }

  render() {

    const { classes, ...other } = this.props;
  
    const categories = [
      {
        id: 'My Notes',
        children: this.state.notes,
      },
    ];

    return (
      <Drawer variant="permanent" {...other}>
        <List disablePadding>
          <ListItem className={classNames(classes.firebase, classes.item, classes.itemCategory)}>
            notes
          </ListItem>
          <ListItem button className={classNames(classes.item, classes.itemCategory)}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
              onClick={this.newNote}
            >
              New Note
            </ListItemText>
          </ListItem>
          {categories.map(({ id, children }) => (
            <React.Fragment key={id}>
              <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}
                >
                </ListItemText>
              </ListItem>
              {children.map(({ id: noteId, name, active }) => (
                <ListItem
                  button
                  dense
                  key={noteId}
                  className={classNames(
                    classes.item,
                    classes.itemActionable,
                    (noteId === this.state.activeNote) && classes.itemActiveItem,
                  )}
                >
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                      textDense: classes.textDense,
                    }}
                  >
                    {name}
                  </ListItemText>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);