/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Mission item in the list of Mission points component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import config from '../../config';
import React, { Component } from 'react';
import { Row, Col, Form, FormControl, InputGroup, ControlLabel, FormGroup, Button, Panel, ButtonToolbar } from 'react-bootstrap';

import 'react-select/dist/react-select.css';
import Select from 'react-select';

import _ from 'lodash';

import commands from './data/commands.js';
import frames from './data/frames.js';

class MissionPointListItem extends Component {

  constructor(props) {
    super(props);

    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handlePanelHeaderClick = this.handlePanelHeaderClick.bind(this);
    this.handleCommandChange = this.handleCommandChange.bind(this);
    this.handleFrameChange = this.handleFrameChange.bind(this);

    // set initial state
    this.state = this.converMissionItemToState(this.props.missionItem);

  }

  getSelectedCommand() {
    if (this.props.missionItemIndex === 0) {
      return 'Planned Home Position';
    } else if (this.props.missionItemIndex === 1) {
      return 'Takeoff';
    } else {
      return 'Waypoint';
    }
  }

  getSelectedlabel() {
    if (this.props.missionItemIndex === 0) {
      return 'H';
    } else if (this.props.missionItemIndex === 1) {
      return 'T';
    } else {
      return this.props.missionItemIndex;
    }
  }

  convertStateToMissionItem() {
    let missionItem = _.clone(this.state);

    missionItem.coordinate = [missionItem.lat, missionItem.lng, missionItem.alt];
    delete missionItem['lat'];
    delete missionItem['lng'];
    delete missionItem['alt'];

    return missionItem;
  }

  converMissionItemToState(missionItem) {
    var state = _.extend({
      lat: this.props.missionItem.coordinate[0],
      lng: this.props.missionItem.coordinate[1],
      alt: this.props.missionItem.coordinate[2]
    }, missionItem);
    delete state['coordinate'];

    return state;
  }

  handleCancelClick() {
    // just in case we could need it send state before it was canceled
    this.props.onCancel(this.convertStateToMissionItem());
    // reset state from initial missionItem
    this.setState(this.converMissionItemToState(this.props.missionItem));
  }

  handleSaveClick() {
    this.props.onSave(this.convertStateToMissionItem());
  }

  handleDeleteClick() {
    this.props.onDelete(this.convertStateToMissionItem());
  }

  handlePanelHeaderClick(event) {
    this.props.onPanelHeaderClick(this.convertStateToMissionItem());
  }

  handleCommandChange(val) {
    this.setState({ command: val.value });
  }

  handleFrameChange(val) {
    this.setState({ frame: val.value });
  }

  handleFloatChange(name, event) {
    const value = event.target.value;

    if ( value.match(/^-?\d*(\.\d*)?$/) ) {
      const changeState = {};
      changeState[name] = value;
      this.setState(changeState);
    }
  }

  handleFloatBlur(name, event) {
    const value = event.target.value;
    const changeState = {};

    changeState[name] = this.getFloatValue(value);
    this.setState(changeState);
  }

  /**
   * Get the float representation of the value
   * @param  {String}     value         the value to parse
   */
  getFloatValue(value) {
    if (value) {
      try {
        return parseFloat(value, 10);
      } catch (e) {
        // value is not a number, return 0
        return parseFloat(0, 10);
      }
    }

    return parseFloat(0, 10);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.missionItemIndex !== 1 && nextProps.missionItemIndex === 1) {
      this.setState({command: config.takeoffMissionItemCommand})
    }
  }

  render() {
    const isHome = this.props.missionItemIndex === 0;

    return (
      <Panel header={
          <Row onClick={this.handlePanelHeaderClick}>
            <Col xs={2} md={2}>{this.getSelectedlabel()}</Col>
            <Col xs={10} md={10} className="pull-right text-right">{this.getSelectedCommand()}</Col>
          </Row>
      } collapsible expanded={this.props.isOpened}>
          <Form horizontal>
            <Row className="m-b-10">
              <Col xs={12} md={12}>
                { isHome ? <p>Planned home position. Actual home position set by vehicle</p>
                         : <p>Provides advanced access to all commands. Be very careful!</p> }
              </Col>
            </Row>
          { !isHome &&
            <div>
              <Row className="m-b-10">
                <Col xs={12} md={12}>
                  <Select clearable={false} searchable={false} name="mav_commands" value={this.state.command}
                    options={commands} onChange={this.handleCommandChange} disabled={this.props.missionItemIndex === 1} />
                </Col>
              </Row>
              <Row className="m-b-10">
                <Col xs={12} md={12}>
                  <Select clearable={false} searchable={false} name="mav_frames" value={this.state.frame}
                    options={frames} onChange={this.handleFrameChange} />
                </Col>
              </Row>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Param1:
                </Col>
                <Col sm={9}>
                  <InputGroup className="full-width">
                    <FormControl type="number" value={this.state.param1} onChange={this.handleFloatChange.bind(this, 'param1')}
                      onBlur={this.handleFloatBlur.bind(this, 'param1')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Param2:
                </Col>
                <Col sm={9}>
                  <InputGroup className="full-width">
                    <FormControl type="number" value={this.state.param2} onChange={this.handleFloatChange.bind(this, 'param2')}
                      onBlur={this.handleFloatBlur.bind(this, 'param2')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Param3:
                </Col>
                <Col sm={9}>
                  <InputGroup className="full-width">
                    <FormControl type="number" value={this.state.param3} onChange={this.handleFloatChange.bind(this, 'param3')}
                      onBlur={this.handleFloatBlur.bind(this, 'param3')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  Param4:
                </Col>
                <Col sm={9}>
                  <InputGroup className="full-width">
                    <FormControl type="number" value={this.state.param4} onChange={this.handleFloatChange.bind(this, 'param4')}
                      onBlur={this.handleFloatBlur.bind(this, 'param4')} />
                  </InputGroup>
                </Col>
              </FormGroup>
            </div>
          }
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Latitude:
            </Col>
            <Col sm={9}>
              <InputGroup className="full-width">
                <FormControl type="number" value={this.state.lat} onChange={this.handleFloatChange.bind(this, 'lat')}
                  onBlur={this.handleFloatBlur.bind(this, 'lat')} />
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Longitude:
            </Col>
            <Col sm={9}>
              <InputGroup className="full-width">
                <FormControl type="number" value={this.state.lng} onChange={this.handleFloatChange.bind(this, 'lng')}
                  onBlur={this.handleFloatBlur.bind(this, 'lng')} />
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Altitude:
            </Col>
            <Col sm={9}>
              <InputGroup className="full-width">
                <FormControl type="number" value={this.state.alt} onChange={this.handleFloatChange.bind(this, 'alt')}
                  onBlur={this.handleFloatBlur.bind(this, 'alt')} />
                <InputGroup.Addon>m</InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col xs={4}>
              { !isHome && <Button bsStyle="danger" onClick={this.handleDeleteClick}>Delete</Button> }
            </Col>
            <Col xs={8}>
              <ButtonToolbar className="pull-right">
                  <Button onClick={this.handleCancelClick}>Cancel</Button>
                  <Button bsStyle="primary" onClick={this.handleSaveClick}>Save</Button>
              </ButtonToolbar>
            </Col>
          </FormGroup>
        </Form>
      </Panel>
    );
  }
}

export default MissionPointListItem;
