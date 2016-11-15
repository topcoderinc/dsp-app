/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The root mission planner component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import InfoWindow from './InfoWindow.js';
import { Form, FormGroup, Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { ToastContainer, ToastMessage } from 'react-toastr';

import MissionApi from '../../api/Mission.js';
import config from '../../config';
import { hashHistory } from 'react-router';
import { MapHelper } from './helpers/MapHelper';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
import TextInput from '../ui/TextInput';

class MissionPlanner extends Component {

  constructor(props) {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMissionItemUpdate = this.handleMissionItemUpdate.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.deleteWaypoint = this.deleteWaypoint.bind(this);
    this.canAddNewPoint = true;
    this.save = this.save.bind(this);
    this.missionApi = new MissionApi(config.api.basePath, props.auth);
    this.state = {
      // the path markers
      markers: [],
      missionItems: [],
      idSequence: 0
    }
  }

  clearAll() {
    MapHelper.clearAll(this);
  }

  onValidMissionName(value) {
    this.setState({ missionName: value });
  }

  save(event) {
    MapHelper.save(event, this, true, hashHistory);
  }

  /**
   * Handle the mission item update fired from info window component
   * @param  {Number}     id                the id of mission item in mission items array
   * @param  {Object}     missionItem       the updated mission item
   */
  handleMissionItemUpdate(id, missionItem) {
    MapHelper.handleMissionItemUpdate(this, id, missionItem);
  }

  /**
  * Handle the click event on the map
  * @param   {object}       event          the propogated event
  */
  handleMapClick(event) {
    MapHelper.addPoint(this, event.latLng, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loaded === false && nextProps.loaded === true) {
      this.loadMap();
    }
  }

  componentDidMount() {
    if (this.props.loaded === true) {
      this.loadMap();
    }
  }

  componentWillUnmount() {
    const _self = this;
    if (_self.poly) {
      _self.poly.setMap(null);
      _self.poly = null;
    }
    // remove all markers
    _self.state.markers.forEach((single) => {
      single.setMap(null);
    });
    _self.map = null;
  }

  loadMap() {
    const _self = this;
    const google = window.google;
    _self.map = new google.maps.Map(_self.mapElement, {
      center: {
        lat: _self.props.lat,
        lng: _self.props.lng
      },
      zoom: _self.props.zoom,
    });
    // add click listener on map
    _self.map.addListener('click', this.handleMapClick);
  }

  deleteWaypoint(id) {
    MapHelper.deleteWaypoint(this, id);
  }

  render() {
    return (
      <Grid fluid={true} className="mission-planner">
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <ToastContainer toastMessageFactory={ToastMessageFactory}
              ref={(element) => this.toastContainer = element} className="toast-top-right" />
          </Col>
        </Row>
        <Row className="show-grid m-b-10">
          <Col xs={6} md={6}>
            <Form horizontal>
              <TextInput name="Name" placeholder="Enter mission name" onValid={this.onValidMissionName.bind(this)} />
              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit" bsSize="small" onClick={this.save}>Save</Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col xs={6} md={6} className="pull-right">
            <ButtonToolbar className="pull-right">
              <Button bsSize="small" onClick={this.clearAll}>Clear All</Button>
              <a type="button" className="btn btn-sm btn-default" href="#/list">List All missions</a>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row className="show-grid map-container-wrapper">
        <Col xs={12} md={12}>
          <div id="map-container" ref={ (element) => this.mapElement = element } />
        </Col>
        <Col xs={3} md={3} className={this.state.missionItems.length > 0 ? 'sidebar' : 'hidden'}>
          {
            this.state.missionItems.map((item, index) => {
              return (
                <InfoWindow key={index} type={ index > 0 ? 'W' : 'T' } onUpdate={this.handleMissionItemUpdate} id={index + 1}
                  deleteWaypoint={this.deleteWaypoint} coordinate={item.coordinate} param1={item.param1} param2={item.param2}
                  param3={item.param3} param4={item.param4} command={item.command} frame={item.frame} />
              );
            })
          }
        </Col>
        </Row>
      </Grid>
    );
  }
}

export default MissionPlanner;
