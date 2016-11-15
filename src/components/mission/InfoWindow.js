/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The mission planner info window component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import { Grid, Row, Col, Form, FormControl, InputGroup, ControlLabel, FormGroup, Glyphicon } from 'react-bootstrap';
import '../../styles/App.css';
import Select from 'react-select';

import 'react-select/dist/react-select.css';
import commands from './data/commands.js';
import frames from './data/frames.js';

class InfoWindow extends Component {

  constructor(props) {
    super(props);
    this.getSelectedCommand = this.getSelectedCommand.bind(this);
    this.getSequence = this.getSequence.bind(this);
    this.handleCommandChange = this.handleCommandChange.bind(this);
    this.handleFrameChange = this.handleFrameChange.bind(this);
    this.toggleFullBody = this.toggleFullBody.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);

    // set initial state
    this.state = {
      type: props.type,
      command: props.command,
      frame: props.frame || 3,
      lat: props.coordinate[0],
      lng: props.coordinate[1],
      altitude: props.coordinate[2],
      param1: props.param1,
      param2: props.param2,
      param3: props.param3,
      param4: props.param4,
      fullBody: 'hidden'
    }
  }

  getSelectedCommand() {
    if (this.state.type === 'T') {
      return 'Takeoff';
    } else if (this.state.type === 'W') {
      return 'Waypoint';
    } else {
      return '';
    }
  }

  getSequence() {
    if (this.state.type !== 'T') {
      return this.props.id;
    }
    return this.state.type;
  }

  /**
   * Get the float representation of the value
   * @param  {String}     value         the value to parse
   */
  getFloatValue(value) {
    if (value) {
      try {
        return parseFloat(value, 10).toFixed(6);
      } catch (e) {
        // value is not a number, return 0
        return parseFloat(0, 10).toFixed(6);
      }
    }
    return parseFloat(0, 10).toFixed(6);
  }

  updateState(name, event, cb) {
    const change = { };
    change[name] = this.getFloatValue(event.target.value);
    this.setState(change, cb);
    console.log(this.state);
  }

  getMissionItem() {
    const missionItem = {
      autoContinue: true,
      command: this.state.command,
      coordinate: [this.state.lat, this.state.lng, this.state.altitude],
      frame: this.state.frame,
      id: this.props.id,
      param1: this.state.param1,
      param2: this.state.param2,
      param3: this.state.param3,
      param4: this.state.param4,
      type: 'missionItem'
    };
    return missionItem;
  }

  handleCommandChange(val) {
    this.setState({ command: val.value }, () => {
      // when type is home this can never fire, so compute mission item for other commands
      const missionItem = this.getMissionItem();
      this.props.onUpdate(this.props.id, missionItem);
    });
  }

  handleFrameChange(val) {
    this.setState({ frame: val.value }, () => {
      // when type is home this can never fire, so compute mission item for other commands
      const missionItem = this.getMissionItem();
      this.props.onUpdate(this.props.id, missionItem);
    });
  }

  handleHomeChange(name, event) {
    this.updateState(name, event, () => {
      const missionItem = this.getMissionItem();
      this.props.onUpdate(this.props.id, missionItem);
    });
  }

  handlePointChange(name, event) {
    const change = { };
    change[name] = this.getFloatValue(event.target.value);
    this.setState(change, () => {
      const missionItem = this.getMissionItem();
      this.props.onUpdate(this.props.id, missionItem);
    });

  }

  toggleFullBody() {
    const newState = this.state.fullBody === 'hidden' ? 'visible' : 'hidden';
    this.setState({fullBody: newState});
  }

  deleteSelf() {
    this.props.deleteWaypoint(this.props.id);
  }

  render() {
    const isHome = this.props.type === 'H';
    return (
      <Grid className="info-window-container">
        <Row className="show-grid m-b-10">
          <Col xs={1} md={1}><Glyphicon className="link" onClick={this.toggleFullBody}
            glyph={this.state.fullBody === 'hidden' ? 'menu-down' : 'menu-up'} /></Col>
          <Col xs={2} md={2}>{this.getSequence()}</Col>
          <Col xs={2} md={2} className="pull-right"><Glyphicon className="link" onClick={this.deleteSelf} glyph="trash" /></Col>
          <Col xs={6} md={6} className="pull-right text-right">{this.getSelectedCommand()}</Col>
        </Row>
        <div className={this.state.fullBody}>
        { isHome === false &&
          <Row className="show-grid m-b-10">
            <Col xs={12} md={12}>
              <p>Provides advanced access to all commands. Be very careful!</p>
            </Col>
          </Row>
        }
        { isHome === true ? (
          <div>
            <Row className="show-grid m-b-10">
              <Col xs={12} md={12}>
                <p>Planned home position. Actual home position set by vehicle</p>
              </Col>
            </Row>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Altitude:
                </Col>
                <Col sm={10}>
                  <InputGroup className="full-width">
                    <FormControl type="number" ref={(homeAltElem) => this.homeAltElement = homeAltElem}
                      value={this.state.altitude} onChange={this.handleHomeChange.bind(this, 'altitude')} />
                    <InputGroup.Addon>m</InputGroup.Addon>
                  </InputGroup>
                </Col>
              </FormGroup>
            </Form>
          </div>
        ) : (
          <div>
            <Row className="show-grid m-b-10">
              <Col xs={12} md={12}>
                <Select clearable={false} searchable={false} name="mav_commands" value={this.state.command}
                  options={commands} onChange={this.handleCommandChange} />
              </Col>
            </Row>
            <Row className="show-grid m-b-10">
              <Col xs={12} md={12}>
                <Select clearable={false} searchable={false} name="mav_frames" value={this.state.frame}
                  options={frames} onChange={this.handleFrameChange} />
              </Col>
            </Row>
            <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                Lat/X:
              </Col>
              <Col sm={10}>
                <InputGroup className="full-width">
                  <FormControl type="text" placeholder={this.state.lat}
                    ref={(latElem) => this.latitudeElement = latElem}
                      onChange={this.handlePointChange.bind(this, 'lat')} />
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                Lon/Y:
              </Col>
              <Col sm={10}>
                <InputGroup className="full-width">
                  <FormControl type="text" placeholder={this.state.lng}
                    ref={(lngElem) => this.longitudeElement = lngElem}
                      onChange={this.handlePointChange.bind(this, 'lng')} />
                </InputGroup>
              </Col>
            </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Param1:
                </Col>
                <Col sm={10}>
                  <InputGroup className="full-width">
                    <FormControl type="text" placeholder={this.props.param1}
                      ref={(param1Elem) => this.param1Element = param1Elem}
                        onChange={this.handlePointChange.bind(this, 'param1')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Param2:
                </Col>
                <Col sm={10}>
                  <InputGroup className="full-width">
                    <FormControl type="text" placeholder={this.props.param2}
                      ref={(param2Elem) => this.param2Element = param2Elem}
                        onChange={this.handlePointChange.bind(this, 'param2')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Param3:
                </Col>
                <Col sm={10}>
                  <InputGroup className="full-width">
                    <FormControl type="text" placeholder={this.props.param3}
                      ref={(param3Elem) => this.param3Element = param3Elem}
                        onChange={this.handlePointChange.bind(this, 'param3')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Param4:
                </Col>
                <Col sm={10}>
                  <InputGroup className="full-width">
                    <FormControl type="text" placeholder={this.props.param4}
                      ref={(param4Elem) => this.param4Element = param4Elem}
                        onChange={this.handlePointChange.bind(this, 'param4')} />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Alt/Z:
                </Col>
                <Col sm={10}>
                  <InputGroup className="altitude">
                    <FormControl type="number" placeholder={this.props.coordinate[2]}
                      ref={(altElem) => this.altitudeElement = altElem}
                        onChange={this.handlePointChange.bind(this, 'altitude')} />
                    <InputGroup.Addon>m</InputGroup.Addon>
                  </InputGroup>
                </Col>
              </FormGroup>
            </Form>
          </div>
        )}
        </div>
      </Grid>
    );
  }
}

export default InfoWindow;
