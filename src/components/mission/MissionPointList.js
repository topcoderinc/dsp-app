/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * List of Mission points component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import { Grid, Row, Col, Alert } from 'react-bootstrap';
import MissionPointListItem from './MissionPointListItem.js';

class MissionPointList extends Component {

  render() {
    return (
      <Grid fluid className="mission-point-list">
        <Row>
          <Col xs={12}>
              {
                !this.props.missionItems.length ?
                  <Alert bsStyle="info">
                    Please, add at least two waypoints on the map.
                  </Alert>
                :
                  this.props.missionItems.map((item, index) => {
                    return <MissionPointListItem
                      key={item.keyId}
                      missionItemIndex={index}
                      missionItem={item}
                      onCancel={this.props.onMissionItemCancel}
                      onSave={this.props.onMissionItemSave}
                      onDelete={this.props.onMissionItemDelete}
                      onPanelHeaderClick={this.props.onPanelHeaderClick}
                      isOpened={this.props.openedListItems.indexOf(item.keyId) > -1}
                    />
                  })
              }
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default MissionPointList;
