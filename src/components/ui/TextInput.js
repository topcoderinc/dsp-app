/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Represents an text input box
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      valid: true,
      name: props.name || 'Name',
      placeholder: props.placeholder || 'placeholder'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const domNode = ReactDOM.findDOMNode(this.textInput);
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
      <FormGroup controlId={`${this.state.name}-input`} validationState={this.state.validationState}>
        <Col componentClass={ControlLabel} sm={2}>
          {this.state.name || 'Name:'}:
        </Col>
        <Col sm={10}>
          <FormControl type="text" placeholder={this.state.placeholder} ref={(element) => this.textInput = element} onChange={this.handleChange} />
        </Col>
      </FormGroup>
    );
  }
}

export default TextInput;
