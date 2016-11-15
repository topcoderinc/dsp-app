/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Mission planner edit component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import MissionPlanner from './MissionPlanner.js';

class MissionPlannerEdit extends Component {

  render() {
    return <MissionPlanner auth={this.props.auth} loaded={this.props.loaded} id={this.props.params && this.props.params.id}/>
  }
}

export default MissionPlannerEdit;
