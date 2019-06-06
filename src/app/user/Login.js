import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Notes from '@material-ui/icons/Notes';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Machinable from '../../apiclient/';

let theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
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
  mainContent: {
    flex: 1,
    padding: '12px 24px 0',
    background: '#eaeff1',
    height: "100vh",
  },
  logo: {
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeAvatar: {
    width: 64,
    height: 64,
  },
  largeAvatarIcon: {
    fontSize: 48
  },
  divider: {
    margin: "12px 0px 12px 0px"
  }
});

class Signin extends Component {
	constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: [],
      loading: false
    }
  }
  handleResponse = (response) => {
		Machinable.user().saveTokens(
			response.data.access_token,
			response.data.refresh_token,
			response.data.session_id
    );
    this.props.history.push('/');
	}

	handleError = (err) => {
    console.log(err);
		var error = 'Issue logging in, please try again.'
		this.setState({
		    loading: false,
        errors: [error]
		  });
	}

  onChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    var errors = [];

    if(!this.state.username) {
      errors.push('Invalid username');
    }

    if(!this.state.password) {
      errors.push('Invalid password');
    }
  
    this.setState({
      errors: errors
    });

    var arr = errors.map(function(k) { return k });

    if(arr.join('').length === 0) {
      var pw = this.state.password;
      var un = this.state.username;
      this.setState({
        loading: true
      });
      Machinable.user().login(un, pw).then(this.handleResponse).catch(this.handleError);
    }
  }

  render = () => {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <main className={classes.mainContent}>
          <div className={classes.main}>
            <CssBaseline />
            <div className={classes.logo}>
              <Avatar className={classes.largeAvatar}>
                <Notes className={classes.largeAvatarIcon}/>
              </Avatar>
            </div>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              {this.state.errors.map(function(v, i){
                return (
                  <Typography key={"error_"+i} color="error">{v}</Typography>
                )
              })}
              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input onChange={this.onChange} id="username" name="username" autoComplete="username" autoFocus />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input onChange={this.onChange} name="password" type="password" id="password" autoComplete="current-password" />
                </FormControl>
                {this.state.loading && <div className="center-items mt15"><CircularProgress/></div>}
                {!this.state.loading && 
                <>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.onSubmit}
                >
                  Sign In
                </Button>

                <Divider light variant="middle" className={classes.divider} />

                <Button fullWidth color="primary" className={classes.button} href="/register">
                  Register
                </Button>
                </>}
              </form>
            </Paper>
          </div>
        </main>
      </MuiThemeProvider>
    );
  }
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signin);