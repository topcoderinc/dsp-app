/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Mission Map component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import config from '../../config';
import React, { Component } from 'react';

import circleGreen from '../../i/circle_green.svg';

class MissionMap extends Component {

  constructor(props) {
    super(props);

    this.markers = [];
  }

  getMarkerOpts(markerIndex, lat, lng) {
    const google = window.google;

    const markerOpts = {
      position: new google.maps.LatLng(lat, lng),
      cursor: 'pointer',
      map: this.map,
      icon: circleGreen,
      label: {
        color: '#759e57',
        text: markerIndex === 0 ? 'H' : (markerIndex === 1 ? 'T' : markerIndex + ''),
        fontWeight: '800'
      }
    };

    return markerOpts;
  }

  loadMap() {
    const google = window.google;

    // init map
    this.map = new google.maps.Map(this.mapElement, config.defaultGoogleMapConfig);
    this.map.addListener('click', this.props.onMapClick);

    this.initPolyline();
  }

  initPolyline() {
    const google = window.google;

    if ( !this.poly ) {
      this.poly = new google.maps.Polyline({
        strokeColor: '#ff794d',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      this.poly.setMap(this.map);
    }
  }

  createMarker(missionItem) {
    const google = window.google;
    this.initPolyline(); // to make sure we inited it could be deleted after 100% testing
    const path = this.poly.getPath();

    // init marker
    const markerOpts = this.getMarkerOpts(missionItem.id, missionItem.coordinate[0], missionItem.coordinate[1]);
    const marker = new google.maps.Marker(markerOpts);

    marker.set('id', missionItem.id);
    marker.addListener('click', (event) => {
      this.props.onMarkerClick(event, missionItem);
    });
    marker.keyId = missionItem.keyId;
    this.markers.push(marker);
    missionItem.id && path.push(new google.maps.LatLng(missionItem.coordinate[0], missionItem.coordinate[1]));
  }

  removeMarker(marker) {
    const markerIndex = this.markers.indexOf(marker);
    const removedMarker = this.markers.splice(markerIndex, 1);

    this.markers = this.markers.map((marker, index) => {
      // takeoff point
      if ( index === 1 ) {
        marker.setLabel('T');
      }
      // waypoints
      if ( index > 1 ) {
        marker.setLabel(index + '');
      }
      return marker;
    });
    removedMarker.pop().setMap(null);
    this.poly.getPath().removeAt(markerIndex - 1);
  }

  syncMarkers() {
    // add new markers
    if ( this.props.missionItems.length > this.markers.length ) {
      for ( let i = this.markers.length; i < this.props.missionItems.length; i++ ) {
        this.createMarker(this.props.missionItems[i]);
      }
    }

    // remove markers
    if ( this.props.missionItems.length < this.markers.length ) {
      // remove from the end of array
      for ( let i = this.markers.length - 1; i >= 0; i-- ) {
        if ( this.isMissionItemRemoved(this.markers[i]) ) {
          this.removeMarker(this.markers[i]);
        }
      }
    }

    // update existed marker positions
    this.updateMarkerPositions();

    // center map if need
    if ( this.props.centerOnUpdate ) {
      this.centerMap();
    }
  }

  updateMarkerPositions() {
    const google = window.google;

    for ( let i = 0; i < this.markers.length; i++ ) {
      let marker = this.markers[i];
      let markerPosition = marker.getPosition();
      let missionItem = this.props.missionItems[i];

      if ( markerPosition.lat() !== missionItem.coordinate[0] || markerPosition.lng() !== missionItem.coordinate[1] ) {
        // update marker position
        marker.setPosition(new google.maps.LatLng(missionItem.coordinate[0], missionItem.coordinate[1]));
        // update line
        i && this.poly.getPath().setAt(i - 1, new google.maps.LatLng(missionItem.coordinate[0], missionItem.coordinate[1]));
      }
    }
  }

  isMissionItemRemoved(marker) {
    let isRemoved = true;

    for ( let missionItem of this.props.missionItems ) {
      if ( missionItem.keyId === marker.keyId ) {
        isRemoved = false;
        break;
      }
    }

    return isRemoved;
  }

  // center and zoom map so all markers can be seen
  centerMap() {
    const google = window.google;

    if ( this.markers.length ) {
      const markersBounds = new google.maps.LatLngBounds();

      for ( let marker of this.markers ) {
        markersBounds.extend(marker.getPosition());
      }

      this.map.setCenter(markersBounds.getCenter());
      this.map.fitBounds(markersBounds);
    }
  }

  componentDidMount() {
    if (this.props.loaded === true) {
      this.loadMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loaded === false && nextProps.loaded === true) {
      this.loadMap();
    }
  }

  componentDidUpdate() {
    if (this.props.loaded === true) {
      this.syncMarkers();
    }
  }

  componentWillUnmount() {
    if (this.poly) {
      this.poly.setMap(null);
      this.poly = null;
    }
    // remove all markers
    this.markers.forEach((single) => {
      single.setMap(null);
    });
    this.map = null;
  }

  render() {
    return <div id="map-container" ref={ (element) => this.mapElement = element } />
  }
}

export default MissionMap;
