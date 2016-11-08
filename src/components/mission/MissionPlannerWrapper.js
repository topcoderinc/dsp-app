/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The mission planner wrapper component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import MissionPlanner from './MissionPlanner.js';

class MissionPlannerWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // represents the map options
      mapOpts: {
        lat: 42.010,
        lng: -96.824,
        zoom: 9
      }
    }
  }

  render() {
    return (
      <MissionPlanner lat={this.state.mapOpts.lat} lng={this.state.mapOpts.lng} zoom={this.state.mapOpts.zoom} loaded={this.props.loaded} auth={this.props.auth} />
    );
  }
}

export default MissionPlannerWrapper;
