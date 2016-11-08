/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The google maps wrapper.
 * This component is the bridge between reat application and google map
 *
 * @author       TCSCODER
 * @version      1.0.0
 */

import React, { Component } from 'react';

import GoogleMap from './GoogleMap.js';

class GoogleApiComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // represents the map options
      mapOpts: {
        lat: 42.010,
        lng: -96.824,
        zoom: 2
      }
    }
  }

  render() {
    return (
      <GoogleMap lat={this.state.mapOpts.lat} lng={this.state.mapOpts.lng} zoom={this.state.mapOpts.zoom} loaded={this.props.loaded} />
    );
  }
}

export default GoogleApiComponent;
