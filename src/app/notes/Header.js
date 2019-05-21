import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import UserIcon from '@material-ui/icons/Mood';
import Toolbar from '@material-ui/core/Toolbar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Leave from '@material-ui/icons/ExitToApp';
import { withStyles } from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
  header: {
    background: '#eaeff1',
  },
  avatar: {
    color: theme.palette.primary.main,
  },
  create: {
    color: theme.palette.primary.dark,
  },
  delete: {
    color: theme.palette.primary.light,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  logout = () => {
    this.props.history.push("/login");
  }

  render = () => {
    const { classes, onDrawerToggle } = this.props;

    return (
      <React.Fragment>
        <AppBar className={classes.header} color="default" position="sticky" elevation={0}>
          <Toolbar>
            <Grid container spacing={8} alignItems="center">
              <Hidden smUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>

              <Grid item xs />

              <Grid item>
                <IconButton 
                  buttonRef={node => {
                    this.anchorEl = node;
                  }}
                  aria-owns={this.state.open ? 'menu-list-grow' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleToggle}
                  color="inherit">
                  <UserIcon className={classes.avatar} />
                </IconButton>
                <Popper open={this.state.open} anchorEl={this.anchorEl} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      id="menu-list-grow"
                      style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={this.handleClose}>
                          <MenuList>
                            <MenuItem onClick={this.logout}>
                              <ListItemIcon>
                                <Leave />
                              </ListItemIcon>
                              <Typography variant="inherit" noWrap>&nbsp;Logout</Typography>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

// redux
function mapStateToProps(state) {
	return {
		editingNote: state.editingNote
	};
}

export default withStyles(styles)(connect(mapStateToProps)(Header));