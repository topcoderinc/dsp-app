/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * List item in MissionPlannerList component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import MissionApi from '../../api/Mission.js';
import config from '../../config';
import { Button } from 'react-bootstrap';
import { hashHistory } from 'react-router';

class MissionListItem extends Component {

  constructor(props) {
    super(props);
    this.missionApi = new MissionApi(config.api.basePath, props.auth);
  }

  deleteMission() {
    this.missionApi.delete(this.props.mission.id).then(() => {
      this.props.refresh();
    });
  }

  getDownloadLink() {
    return `${config.api.basePath}/api/v1/missions/${this.props.mission.id}/download?token=${this.props.auth.getToken()}`;
  }

  edit() {
    hashHistory.push(`/missions/${this.props.mission.id}`);
  }

  render() {
    return (
      <tr>
        <td>{this.props.mission.missionName}</td>
        <td>
          <Button bsSize="small" onClick={this.edit.bind(this)}>Edit</Button>
        </td>
        <td>
          <a type="button" className="btn btn-sm btn-default" href={this.getDownloadLink()}>Download</a>
        </td>
        <td>
          <Button bsSize="small" onClick={this.deleteMission.bind(this)}>Delete</Button>
        </td>
      </tr>
    );
  }
}

export default MissionListItem;
