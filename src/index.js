/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The main react application entry point
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import config from './config';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import Login from './components/auth/Login.js';
import GoogleApiComponent from './components/maps/GoogleApiComponent.js';
import MissionPlannerCreate from './components/mission/MissionPlannerCreate.js';
import MissionPlannerEdit from './components/mission/MissionPlannerEdit.js';
import MissionList from './components/mission/MissionList.js';
import AuthService from './components/auth/utils/AuthService.js';

const auth = new AuthService(config.AUTH0_CLIEND_ID, config.AUTH0_DOMAIN);
// import components
import Signup from './components/auth/Signup.js';

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' });
  }
}

const authRedirect = (nextState, replace) => {
  if (auth.loggedIn()) {
    replace({ pathname: '/planner' });
  }
}

class AppWrapper extends Component {
  /**
   * Util function to render the children
   * Whenever a state change happens in react application, react will render the component again
   * and we wish to pass the updated state to the children as props
   */
  renderChildren() {
    const {children} = this.props;
    if (!children) {
      return;
    }
    const sharedProps = {
      auth: this.props.auth,
      loaded: this.props.isScriptLoaded && this.props.isScriptLoadSucceed
    }
    return React.Children.map(children, c => {
      return React.cloneElement(c, sharedProps, {

      });
    });
  }

  render() {
    const child = this.renderChildren();
    return (
      <App auth={auth}>
        {child}
      </App>
    );
  }
}

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={AppWrapper}>
      <IndexRedirect to="/login" />
      <Route path="signup" component={Signup} onEnter={authRedirect} />
      <Route path="login" component={Login} onEnter={authRedirect} />
      <Route path="drones" component={GoogleApiComponent} />
      <Route path="list" component={MissionList} onEnter={requireAuth} />
      <Route path="missions/:id" component={MissionPlannerEdit}  onEnter={requireAuth} />
      <Route path="planner" component={MissionPlannerCreate} onEnter={requireAuth} />
      <Route path="access_token=:token" />
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
