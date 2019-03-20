import React, { Component } from 'react';
import Login from '../app/user/Login';
import Register from '../app/user/Register';
import { Route, Switch } from 'react-router-dom';

class User extends Component {

	render() {

		return (
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
		  );
	}
}

export default User;