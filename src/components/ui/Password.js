/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Represents an password input box
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      valid: true
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const domNode = ReactDOM.findDOMNode(this.passwordInput);
    const value = domNode.value;
    if (value) {
      // do something on validation
      this.setState({ validationState: 'success', valid: true, touched: true });
      this.props.onValid(value);
    } else {
      // value is invalid
      this.setState({ valid: false, validationState: 'error', touched: true });
      this.props.onValid();
    }
  }

  render() {
    return (
      <FormGroup controlId="password" validationState={this.state.validationState}>
        <Col componentClass={ControlLabel} sm={2}>
          Password
        </Col>
        <Col sm={10}>
          <FormControl type="password" placeholder="Password" ref={(element) => this.passwordInput = element} onChange={this.handleChange} />
        </Col>
      </FormGroup>
    );
  }
}

export default PasswordInput;
