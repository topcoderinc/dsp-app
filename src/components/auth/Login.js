/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Login component for the app.
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import { ButtonToolbar, Grid, Row, Form, FormGroup, Col, Button } from 'react-bootstrap';
import EmailInput from '../ui/EmailInput.js';
import PasswordInput from '../ui/Password.js';
import UserApi from '../../api/User.js';
import config from '../../config';
import { hashHistory } from 'react-router';
import { ToastContainer, ToastMessage } from 'react-toastr';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

const userApi = new UserApi(config.api.basePath);

class Login extends Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    // initial state
    this.state = { email: null, password: null };
    this.setPassword = this.setPassword.bind(this);
    this.setEmail = this.setEmail.bind(this);
  }

  login(event) {
    event.preventDefault();
    const _self = this;
    userApi.login(this.state.email, this.state.password).then((authResult) => {
      this.props.auth.setToken(authResult.accessToken);
      hashHistory.push('/planner');
    }).catch((err) => {
      _self.toastContainer.error('',
        `${err.response || 'something went wrong'}`, {
        timeOut: 3000,
        preventDuplicates:false
      });
    });
  }

  setEmail(email) {
    this.setState({ email: email });
  }

  setPassword(password) {
    this.setState({ password: password });
  }

  register() {
    hashHistory.push('/signup');
  }

  /**
   * Render the dom
   */
  render() {
    return (
      <Grid fluid>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <ToastContainer toastMessageFactory={ToastMessageFactory}
              ref={(element) => this.toastContainer = element} className="toast-top-right" />
          </Col>
        </Row>
        <Row className="show-grid m-b-10">
          <Col xs={6} md={6} className="col-centered">
            <Form horizontal>
              <EmailInput onValid={this.setEmail} />

              <PasswordInput onValid={this.setPassword} />

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <ButtonToolbar>
                    <Button type="submit" bsSize="small" onClick={this.login} disabled={!this.state.email || !this.state.password}>
                      Sign in
                    </Button>
                    <Button type="submit" className="pull-right" bsSize="small" onClick={this.register.bind(this)}>
                      Register
                    </Button>
                    <Button bsSize="small" className="pull-right" onClick={this.props.auth.login.bind(this)}>Social Login</Button>
                  </ButtonToolbar>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Login;
