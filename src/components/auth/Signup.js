/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Signup component for the app.
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import { Grid, Row, Form, FormGroup, Col, Button } from 'react-bootstrap';
import EmailInput from '../ui/EmailInput.js';
import PasswordInput from '../ui/Password.js';
import TextInput from '../ui/TextInput.js';
import UserApi from '../../api/User.js';
import config from '../../config';
import { hashHistory } from 'react-router';
import { ToastContainer, ToastMessage } from 'react-toastr';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

const userApi = new UserApi(config.api.basePath);

class Signup extends Component {

  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    // initial state
    this.state = { email: null, password: null, name: null };
    this.setPassword = this.setPassword.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setName = this.setName.bind(this);
  }

  register(event) {
    event.preventDefault();
    const _self = this;
    userApi.register(this.state.name, this.state.email, this.state.password).then(() => {
      _self.toastContainer.success('',
        'user registered successfully, kindly login', {
        timeOut: 2000,
        preventDuplicates:false
      });
      setTimeout(() => {
        hashHistory.push('/login');
      }, 3000);
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

  setName(name) {
    this.setState({ name: name });
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
              <TextInput onValid={this.setName} placeholder="name" name="Name" />

              <EmailInput onValid={this.setEmail} />

              <PasswordInput onValid={this.setPassword} />

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit" onClick={this.register} disabled={!this.state.email || !this.state.password || !this.state.name}>
                    Register
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Signup;
