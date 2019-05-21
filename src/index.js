import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux'; 
import store from './store';
import createHistory from 'history/createBrowserHistory';
import Home from './containers/Home';
import User from './containers/User';
import Machinable from './apiclient/';
import './index.css';

// Add a 401 response interceptor
// This will intercept 401 status codes and attempt to refresh the user's access token.
// If a 401 is returned from the refresh attempt, the refresh token is expired and the user
// needs to login again.
axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	if (401 === error.response.status && 
		error.response.data.error && 
		error.response.data.error === "invalid access token") {

		return Machinable.user().refreshToken()
				  .then((response) => {
					console.log("refreshed access token.")
					if(response) {
						Machinable.setAccessToken(response.data.access_token);
					  	error.config.headers.Authorization = "Bearer " + response.data.access_token;
					  	return axios.request(error.config);
					}
				  });
	} 
	else if ((401 === error.response.status) || 
				(404 === error.response.status && 
				error.response.data.message && 
				error.response.data.message === "error creating access token.")) {
		Machinable.user().logout(function(){
			history.push('/login');
		}, function(){
			history.push('/login');
		});
	} 
	else {
	  // return the actual error response and handle it explicitly
	  return Promise.reject(error.response);
	}
});

const history = createHistory();

const App = () => (
	<div>
		{/* <div className="text-warning padding-less text-center text-small">Machinable is in Alpha. Data will be cleared regularly.</div> */}
		<Router history={history}>
			<Switch>
				<Route path="/login" component={User} />
				<Route path="/register" component={User} />

				<Route path="/:noteId" component={({history, match}) => <Home history={history} match={match}/>} />
				<Route path="/" component={({history, match}) => <Home history={history} match={match}/>} />
			</Switch>
		</Router>
	</div>
)

ReactDOM.render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('root'));