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
import ReactDOM from 'react-dom';
import circleGreen from '../../i/circle_green.svg';
import InfoWindow from './InfoWindow.js';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import { ToastContainer, ToastMessage } from 'react-toastr';

import MissionApi from '../../api/Mission.js';
import config from '../../config';
import { hashHistory } from 'react-router';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class EditMissionPlanner extends Component {

  constructor(props) {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMissionItemUpdate = this.handleMissionItemUpdate.bind(this);
    this.doHandleMarkerClick = this.doHandleMarkerClick.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.save = this.save.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.missionApi = new MissionApi(config.api.basePath, props.auth);
    this.state = {
      // the path markers
      markers: [],
      missionItems: [],
      idSequence: 0
    }
  }

  clearAll() {
    this.poly.setMap(null);
    this.poly = null;
    this.state.markers.forEach((single) => {
      single.setMap(null);
    });
    this.setState({ markers: [], missionItems: [], idSequence: 0 });
  }

  save(event) {
    event.preventDefault();
    const _self = this;
    if (_self.state.missionItems.length === 0) {
      _self.toastContainer.warning('',
        'Add some waypoints before saving a mission', {
        timeOut: 3000,
        preventDuplicates:true
      });
    } else if (!_self.state.missionName) {
      _self.toastContainer.warning('',
        'Enter a mission name', {
        timeOut: 3000,
        preventDuplicates:true
      });
    } else {
      // save the mission
      _self.missionApi.update(_self.props.missionId, _self.state.missionName, _self.state.missionItems, _self.state.plannedHomePosition).then(() => {
        _self.toastContainer.success('',
          'Mission updated', {
          timeOut: 1000,
          preventDuplicates:false
        });
        setTimeout(() => {
          hashHistory.push('/list');
        }, 2000);
      });
    }
  }

  /**
   * Handle the mission item update fired from info window component
   * @param  {Number}     id                the id of mission item in mission items array
   * @param  {Object}     missionItem       the updated mission item
   */
  handleMissionItemUpdate(id, missionItem) {
    if (id === 0) {
      this.setState({ plannedHomePosition: missionItem });
    } else {
      const missionItems = this.state.missionItems;
      missionItems.splice(id - 1, 1, missionItem);
      this.setState({ missionItems: missionItems });
    }
  }

  /**
   * Actual marker click handler
   * @param  {MouseEvent}     event         the MouseEvent object fired by google map api
   * @param  {Marker}         marker        the maker which is clicked
   * @param  {Object}         item          the mission item object
   */
  doHandleMarkerClick(event, marker, item) {
    const _self = this;
    const google = window.google;
    const div = document.createElement('div');
    const id = marker.get('id');
    ReactDOM.render(_self.renderInfoWindow(marker.getLabel().text, { lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng() }, item, id), div);
    const infoWindow = new google.maps.InfoWindow({
      content: div,
      maxWidth: 400
    });
    infoWindow.open(_self.map, marker);
  }

  /**
   * Attach the click event on marker and handle the click event on the marker
   *
   * @param   {object}       event          the propogated event
   * @param   {Object}       item           the mission item object
   */
  handleMarkerClick(marker, item) {
    const _self = this;
    marker.addListener('click', (event) => {
      _self.doHandleMarkerClick(event, marker, item);
    });
  }

  /**
   * Render the info window for the specified type i.e, H, T, W
   */
  renderInfoWindow(type, position, item, id) {
    return (
      <InfoWindow type={type} onUpdate={this.handleMissionItemUpdate} id={id} position={position} param1={item.param1}
        param2={item.param2} param3={item.param3} param4={item.param4} altitude={item.coordinate[2]} command={item.command} frame={item.frame} />
    );
  }

  initPolyline() {
    const google = window.google;
    const _self = this;
    if (!_self.poly) {
      _self.poly = new google.maps.Polyline({
        strokeColor: '#ff794d',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      _self.poly.setMap(_self.map);
    }
  }

  getMarkerOpts(idSequence, lat, lng) {
    const _self = this;
    const google = window.google;
    const markerOpts = {
      position: new google.maps.LatLng(lat, lng),
      cursor: 'pointer',
      map: _self.map,
      icon: circleGreen
    };
    if (idSequence === 0) {
      // add the home
      markerOpts.label = {
        color: '#759e57',
        text: 'H',
        fontWeight: '800'
      };
    } else if (idSequence === 1) {
      // add the takeoff marker
      markerOpts.label = {
        color: '#759e57',
        text: 'T',
        fontWeight: '800'
      };
    } else {
      // add general waypoint marker
      markerOpts.label = {
        color: '#759e57',
        text: `${idSequence}`,
        fontWeight: '800'
      };
    }
    return markerOpts;
  }

  getMissionItem(idSequence, lat, lng, alt) {
    if (idSequence !== 0) {
      return {
        autoContinue: true,
        command: idSequence === 1 ? 22 : 16,
        coordinate: [lat, lng, alt],
        frame: 3,
        id: idSequence,
        param1: 0.000000,
        param2: 0.000000,
        param3: 0.000000,
        param4: 0.000000,
        type: 'missionItem'
      }
    }
    return {
      autoContinue: true,
      command: 16,
      coordinate: [lat, lng, alt],
      frame: 0,
      id: idSequence,
      param1: 0.000000,
      param2: 0.000000,
      param3: 0.000000,
      param4: 0.000000,
      type: 'missionItem'
    }
  }

  addPoint(latLng, alt) {
    const google = window.google;
    const _self = this;
    _self.initPolyline();
    const path = _self.poly.getPath();
    const markers = _self.state.markers;
    let idSequence = _self.state.idSequence;
    const markerOpts = _self.getMarkerOpts(idSequence, latLng.lat(), latLng.lng());
    const marker = new google.maps.Marker(markerOpts);
    marker.set('id', idSequence);
    const missionItems = _self.state.missionItems;
    const missionItem = _self.getMissionItem(idSequence, latLng.lat(), latLng.lng(), alt);
    if (idSequence !== 0) {
      // if id sequence is 0 than it is home point, so home point is not added to mission items.
      missionItems.push(missionItem);
    } else {
      _self.setState({ plannedHomePosition: missionItem });
    }
    idSequence += 1;
    _self.handleMarkerClick(marker, missionItem);
    markers.push(marker);
    _self.setState({ markers: markers, idSequence: idSequence, missionItems: missionItems });
    if (idSequence !== 1) {
      path.push(latLng);
    }
  }

  /**
   * Handle the click event on the map
   * @param   {object}       event          the propogated event
   */
  handleMapClick(event) {
    this.addPoint(event.latLng, 25.000000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loaded === false && nextProps.loaded === true) {
      this.loadMap();
    }
  }

  shouldComponentUpdate() {
    // never update the map, rendering is delegated to google api
    return false;
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

  loadInitialPoints(mission) {
    const _self = this;
    const google = window.google;
    _self.initPolyline();
    const path = _self.poly.getPath();
    const markers = _self.state.markers;

    // add planned home position marker
    const markerOpts = _self.getMarkerOpts(0, mission.plannedHomePosition.coordinate[0],
      mission.plannedHomePosition.coordinate[1]);
    const marker = new google.maps.Marker(markerOpts);
    marker.set('id', 0);
    _self.handleMarkerClick(marker, mission.plannedHomePosition);
    markers.push(marker);

    mission.missionItems.forEach((single, index) => {
      const markerOpts = _self.getMarkerOpts(index + 1, single.coordinate[0], single.coordinate[1]);
      const marker = new google.maps.Marker(markerOpts);
      marker.set('id', index + 1);
      _self.handleMarkerClick(marker, single);
      markers.push(marker);
      path.push(new google.maps.LatLng(single.coordinate[0], single.coordinate[1]));
    });
    _self.setState({ markers: markers, idSequence: mission.missionItems.length + 1,
      missionItems: mission.missionItems,
      plannedHomePosition: mission.plannedHomePosition, missionName: mission.missionName });
  }

  loadMap() {
    const _self = this;
    const google = window.google;
    _self.missionApi.getSingle(_self.props.missionId).then((mission) => {
      _self.map = new google.maps.Map(_self.mapElement, {
        center: {
          lat: _self.props.lat,
          lng: _self.props.lng
        },
        zoom: _self.props.zoom,
      });
      // add click listener on map
      _self.map.addListener('click', this.handleMapClick);
      _self.loadInitialPoints(mission);
    });
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
          <Col xs={6} md={6} className="pull-right">
            <ButtonToolbar className="pull-right">
              <Button type="submit" bsSize="small" onClick={this.save}>Update</Button>
              <Button bsSize="small" onClick={this.clearAll}>Clear All</Button>
              <a type="button" className="btn btn-sm btn-default" href="#/list">List All missions</a>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row className="show-grid map-container-wrapper">
          <Col xs={12} md={12}>
            <div id="map-container" ref={ (element) => this.mapElement = element } />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default EditMissionPlanner;
