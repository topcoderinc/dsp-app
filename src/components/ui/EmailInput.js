/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Represents an email input box
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';

const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

class EmailInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      valid: true
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const domNode = ReactDOM.findDOMNode(this.emailInput);
    const value = domNode.value;
    if (value && EMAIL_REGEXP.test(value)) {
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
      <FormGroup controlId="email" validationState={this.state.validationState}>
        <Col componentClass={ControlLabel} sm={2}>
          Email
        </Col>
        <Col sm={10}>
          <FormControl type="email" placeholder="Email" ref={(element) => this.emailInput = element} onChange={this.handleChange} />
        </Col>
      </FormGroup>
    );
  }
}

export default EmailInput;
