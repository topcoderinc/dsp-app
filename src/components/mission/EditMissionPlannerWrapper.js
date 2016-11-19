/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The edit mission planner wrapper component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import EditMissionPlanner from './EditMissionPlanner.js';

const defaultMapLocation = {
  lat: 42.010,
  lng: -96.824,
  zoom: 9
}

class EditMissionPlannerWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // represents the map options
      mapOpts: defaultMapLocation,
      id: props.params.id
    }
  }

  render() {
    return (
      <EditMissionPlanner missionId={this.state.id} lat={this.state.mapOpts.lat} lng={this.state.mapOpts.lng} zoom={this.state.mapOpts.zoom} loaded={this.props.loaded} auth={this.props.auth} />
    );
  }
}

export default EditMissionPlannerWrapper;
