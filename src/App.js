/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The main application component.
 * This is the main UI entry point for a react application
 *
 * @author       TCSCODER
 * @version      1.0.0
 */

import React, { Component } from 'react';
import './styles/App.css';
import scriptLoader from 'react-async-script-loader';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { hashHistory } from 'react-router';

class App extends Component {

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

  logout() {
    this.props.auth.logout();
    hashHistory.push('/login');
  }


  /**
   * Render the dom
   */
  render() {
    const isLoggedIn = this.props.auth.loggedIn();
    const child = this.renderChildren();
    if (isLoggedIn) {
      return (
        <div className="full-height">
          <Navbar fluid className="navbar-wrapper">
            <Nav>
              <NavItem eventKey={1} href="#/drones">Drones</NavItem>
              <NavItem eventKey={2} href="#/planner">Planner</NavItem>
              <NavItem eventKey={3} onClick={this.logout.bind(this)} >Logout</NavItem>
              <NavItem eventKey={4} href="#/">test: {process.env.FOO}</NavItem>
              <NavItem eventKey={5} href="#/">test2: {process.env.BIZ}</NavItem>
            </Nav>
          </Navbar>
          {child}
        </div>
      );
    } else {
      return (
        <div className="full-height">
          <Navbar fluid className="navbar-wrapper">
            <Nav>
              <NavItem eventKey={1} href="#/login">Login</NavItem>
              <NavItem eventKey={2} href="#/drones">Drones</NavItem>
            </Nav>
          </Navbar>
          {child}
        </div>
      );
    }
  }
}

export default scriptLoader(
  ['https://maps.googleapis.com/maps/api/js?key=AIzaSyCR3jfBdv9prCBYBOf-fPUDhjPP4K05YjE', 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js']
)(App);
