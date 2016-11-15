/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * The missions list component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import React, { Component } from 'react';
import MissionApi from '../../api/Mission.js';
import config from '../../config';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import MissionListItem from './MissionListItem.js';

class MissionList extends Component {

  constructor(props) {
    super(props);
    this.missionApi = new MissionApi(config.api.basePath, props.auth);
    this.state = {
      missions: []
    }
  }

  componentDidMount() {
    this.missionApi.getAll().then((missions) => {
      this.setState({ missions: missions });
    });
  }

  refresh() {
    this.missionApi.getAll().then((missions) => {
      this.setState({ missions: missions });
    });
  }

  render() {
    const rows = [];
    this.state.missions.forEach((single) => {
      rows.push(<MissionListItem mission={single} key={single.id} auth={this.props.auth} refresh={this.refresh.bind(this)} />);
    });
    const table = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Mission Name</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    );
    const notFound = (
      <p>No missions found</p>
    );
    let content = notFound;
    if (rows && rows.length > 0) {
      content = table;
    }
    return (
      <Grid fluid>
        <Row className="show-grid">
          <Col xs={12} md={12}>
            {content}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default MissionList;
