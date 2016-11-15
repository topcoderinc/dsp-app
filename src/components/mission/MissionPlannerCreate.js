/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Mission planner create component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import MissionPlanner from './MissionPlanner.js';

class MissionPlannerCreate extends Component {

  render() {
    return <MissionPlanner auth={this.props.auth} loaded={this.props.loaded}/>
  }
}

export default MissionPlannerCreate;
