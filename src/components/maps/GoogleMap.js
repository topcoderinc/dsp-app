/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The google map component.
 *
 * @author       TCSCODER
 * @version      1.0.0
 */

import React, { Component } from 'react';
import '../../styles/App.css';
import config from '../../config';
import DroneApi from '../../api/Drone.js';
import socketClient from 'socket.io-client';
import _ from 'lodash';

const socket = socketClient(config.socket.url);

const droneApi = new DroneApi(config.api.basePath);

class GoogleMap extends Component {

  shouldComponentUpdate() {
    // never update the map, rendering is delegated to google api
    return false;
  }

  /**
   * Return the marker configuration from drone configuration
   * @param  {Object}     drone       the drone
   * @return {Object}                 the marker configuration to display drone
   */
  getMarkerConfig(drone) {
    const google = window.google;
    const config = { clickable: false, crossOnDrag: false,
      cursor: 'pointer', position: new google.maps.LatLng(drone.lat, drone.lng) };
    switch (drone.status) {
      case 'in-motion':
        config.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        break;
      case 'idle-ready':
        config.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
        break;
      case 'idle-busy':
        config.icon = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        break;
      default:
        throw new Error(`invalid drone status ${drone.status}`);
    }
    return config;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loaded === false && nextProps.loaded === true) {
      this.loadMap();
      this.setupSocket();
    }
  }

  componentDidMount() {
    if (this.props.loaded === true) {
      this.loadMap();
      this.setupSocket();
    }
  }

  componentWillUnmount() {
    const _self = this;
    // remove all markers
    _self.markers &&  _self.markers.forEach((single) => {
      single.setMap(null);
    });
  }

  /**
   * Load the initial google map
   */
  loadMap() {
    const _self = this;
    const google = window.google;
    const MarkerClusterer = window.MarkerClusterer;
    _self.map = new google.maps.Map(_self.mapElement, {
      center: {
        lat: _self.props.lat,
        lng: _self.props.lng
      },
      zoom: _self.props.zoom,
    });
    // get a list of all the drones
    droneApi.getAll().then((drones) => {
      _self.markers = drones.map((single) => {
        const marker = new google.maps.Marker(_self.getMarkerConfig(single));
        // set the marker id, to identify a drone uniquely
        marker.set('id', single.id);
        return marker;
      });
      _self.markerCluster = new MarkerClusterer(_self.map, _self.markers, { imagePath: 'i/m' });
    });
  }

  /**
   * Setup the socket connection to listen for incoming update position events
   */
  setupSocket() {
    const _self = this;
    const google = window.google;
    socket.on('dronepositionupdate', (data) => {
      // find a marker by id
      const marker = _.find(_self.markers, { id: data.id });
      if (marker) {
        marker.setPosition(new google.maps.LatLng(data.lat, data.lng));
        // repaint the cluster
        _self.markerCluster.repaint();
      }
    });
  }

  /**
   * Render a map
   */
  render() {
    return (
      <div id="map-container" ref={ (element) => this.mapElement = element } />
    );
  }
}

export default GoogleMap;
