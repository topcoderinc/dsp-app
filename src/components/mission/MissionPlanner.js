/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Mission planner component
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import config from '../../config';
import React, { Component } from 'react';
import MissionPointList from './MissionPointList.js';
import MissionMap from './MissionMap.js';
import { Form, FormGroup, Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import TextInput from '../ui/TextInput';
import { ToastContainer, ToastMessage } from 'react-toastr';

import MissionApi from '../../api/Mission.js';
import { hashHistory } from 'react-router';
import _ from 'lodash';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class MissionPlanner extends Component {

  constructor(props) {
    super(props);

    this.missionApi = new MissionApi(config.api.basePath, props.auth);

    // handlers
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMissionItemCancel = this.handleMissionItemCancel.bind(this);
    this.handleMissionItemSave = this.handleMissionItemSave.bind(this);
    this.handleMissionItemDelete = this.handleMissionItemDelete.bind(this);
    this.handleMissionItemHeaderClick = this.handleMissionItemHeaderClick.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.save = this.save.bind(this);
    this.addPoint = this.addPoint.bind(this);

    // initial state
    this.state = {
      missionId: this.props.id,
      missionName: '',
      missionItems: [],
      openedMissionItems: [], // opened 'tabs' in the mission list panel on the right sidebar
      centerMapOnUpdate: false // whether to center map after points are updated
    }
  }

  /**
   * Load data when component in mounted
   */
  componentDidMount() {
    this.loadMission();
  }

  /**
   * Loads existed mission from the server
   */
  loadMission() {
    if ( this.state.missionId ) {
      this.missionApi.getSingle(this.state.missionId).then((mission) => {
        const missionItems = mission.missionItems;

        // add planned home position to missionItems list
        missionItems.unshift(mission.plannedHomePosition);

        // init markers for all missionItems and extend missionItems
        missionItems.forEach((missionItem) => {
          // add unique id
          missionItem.keyId = _.uniqueId();
        });

        this.setState({
          missionName: mission.missionName,
          missionItems: missionItems,
          centerMapOnUpdate: true
        });
      });
    }
  }

  /**
   * Clear all mission poitns
   */
  clearAll() {
    this.setState({ missionItems: [], openedMissionItems: [], centerMapOnUpdate: false });
  }

  /**
   * Callback when mission name is valid
   * @param  {string} value mission name from text field
   */
  onValidMissionName(value) {
    this.setState({ missionName: value, centerMapOnUpdate: false });
  }

  /**
   * Save current mission
   * @param  {Event} event
   */
  save(event) {
    event.preventDefault();
    const _self = this;

    if (_self.state.missionItems.length < 2) {
      _self.toastContainer.warning('',
        'Add at least two waypoints before saving a mission', {
        timeOut: 3000,
        preventDuplicates:true
      });
    } else if (!_self.state.missionName) {
      _self.toastContainer.warning('',
        'Enter a mission name', {
        timeOut: 3000,
        preventDuplicates:true
      });
    } else if (_self.state.openedMissionItems.length) {
      _self.toastContainer.warning('',
        'Cancel or Save currently edited waypoints first', {
        timeOut: 3000,
        preventDuplicates:true
      });
    } else {
      // prepeare missionItems for saving
      const missionItems = _self.state.missionItems.map((missionItem) => {
        var clone = _.clone(missionItem);
        delete clone.keyId;
        return clone;
      });

      // save the mission
      if ( _self.state.missionId ) {
        _self.missionApi.update(_self.state.missionId, _self.state.missionName, missionItems.slice(1), missionItems[0]).then(() => {
          _self.onSaveSuccess('Mission updated');
        });
      } else {
        _self.missionApi.save(_self.state.missionName, missionItems.slice(1),  missionItems[0]).then(() => {
          _self.onSaveSuccess('Mission saved');
        });
      }
    }
  }

  /**
   * Callback when mission is succesfully save
   * @param  {string} messageText Text of the messge to show
   */
  onSaveSuccess(messageText) {
    this.toastContainer.success('',
      messageText, {
        timeOut: 1000,
        preventDuplicates:false
      }
    );

    setTimeout(() => {
      hashHistory.push('/list');
    }, 2000);
  }

  /**
   * Returns mission item index in mission item list identified by keyId
   * @param  {Object} missionItem  mission item we are looking for
   * @param  {Array}  missionItems mission item list
   * @return {Number}              mission item index
   */
  getMissionItemIndex(missionItem, missionItems) {
    let missionItemIndex = -1;

    for ( let tmlItem of missionItems ) {
      missionItemIndex++
      if ( tmlItem.keyId === missionItem.keyId ) {
        break;
      }
    }

    return missionItemIndex;
  }

  /**
   * Handle the mission item update is canceled fired from WissionPointListItem component
   * @param  {Object}     missionItem       edited but canceled value of missionItem
   */
  handleMissionItemCancel(missionItem) {
    this.closeMissionItemPanel(missionItem);
  }

  /**
   * Handle the mission item update fired from info window component
   * @param  {Object}     missionItem       the updated mission item
   */
  handleMissionItemSave(missionItem) {
    this.setState((prevState) => {
      const missionItems = _.clone(prevState.missionItems);
      const missionItemIndex = this.getMissionItemIndex(missionItem, missionItems);

      missionItems.splice(missionItemIndex, 1, missionItem);

      return { missionItems: missionItems, centerMapOnUpdate: false }
    });
    this.closeMissionItemPanel(missionItem);
  }

  /**
   * Handle the mission item delete fired from info window component on delete button press
   * @param  {Object} missionItem          the id of mission item in mission items array
   */
  handleMissionItemDelete(missionItem) {
    this.setState((prevState) => {
      let missionItems = _.clone(prevState.missionItems);
      const missionItemIndex = this.getMissionItemIndex(missionItem, missionItems);

      missionItems.splice(missionItemIndex, 1);
      missionItems = missionItems.map((missionItem, index) => {
        // tekeoff point
        if ( index === 1 ) {
          missionItem.command = config.takeoffMissionItemCommand;
        }
        missionItem.id = index;
        return missionItem;
      });

      return { missionItems: missionItems, centerMapOnUpdate: false }
    });
    this.closeMissionItemPanel(missionItem);
  }

  /**
   * Handle mission item header click in right panel
   * @param  {Object} missionItem the mission item object
   */
  handleMissionItemHeaderClick(missionItem) {
    this.openMissionItemPanel(missionItem);
  }

  /**
   * Actual marker click handler
   * @param  {MouseEvent}     event         the MouseEvent object fired by google map api
   * @param  {Object}         missionItem   the mission item object
   */
  handleMarkerClick(event, missionItem) {
    this.openMissionItemPanel(missionItem);
  }

  /**
   * Open mission item panel
   * @param  {Object} missionItem the mission item object
   */
  openMissionItemPanel(missionItem) {
    this.setState((prevState) => {
      if ( prevState.openedMissionItems.indexOf(missionItem.keyId) < 0 ) {
        const openedMissionItems = _.clone(prevState.openedMissionItems);
        openedMissionItems.push(missionItem.keyId);
        return { openedMissionItems: openedMissionItems, centerMapOnUpdate: false };
      }
    });
  }

  /**
   * Close mission item panel
   * @param  {Object} missionItem the mission item object
   */
  closeMissionItemPanel(missionItem) {
    this.setState((prevState) => {
      let missionItemIndex = prevState.openedMissionItems.indexOf(missionItem.keyId)
      if ( missionItemIndex > -1 ) {
        const openedMissionItems = _.clone(prevState.openedMissionItems);
        openedMissionItems.splice(missionItemIndex, 1)
        return { openedMissionItems: openedMissionItems, centerMapOnUpdate: false };
      }
    });
  }

  /**
   * Create missionItem
   * @param  {Integer} missionItemIndex  mission item index in the list
   * @param  {Number} lat               Latitude
   * @param  {Number} lng               Longitude
   * @param  {Number} alt               Altitude
   * @return {Object}                   missionItem
   */
  getMissionItem(missionItemIndex, lat, lng, alt) {
    return _.extend({}, config.defaultMissionItem, {
      keyId: _.uniqueId(),
      command: missionItemIndex === 1 ? config.takeoffMissionItemCommand : config.defaultMissionItem.command,
      coordinate: [lat, lng, alt],
      id: missionItemIndex
    });
  }

  /**
   * Add new point to mission item list
   * @param {Object} latLng coordinates of the point
   * @param {[type]} alt    altitude of the point
   */
  addPoint(latLng, alt) {
    this.setState((prevState) => {
      const missionItems = _.clone(prevState.missionItems);
      const missionItemIndex = missionItems.length;
      const missionItem = this.getMissionItem(missionItemIndex, latLng.lat(), latLng.lng(), alt);
      missionItems.push(missionItem);

      return { missionItems: missionItems, centerMapOnUpdate: false }
    });
  }

  /**
   * Handle the click event on the map
   * @param   {object}       event          the propogated event
   */
  handleMapClick(event) {
    this.addPoint(event.latLng, config.defaultMissionItem.coordinate[2]);
  }

  render() {
    return (
      <Grid fluid={true} className="mission-planner">
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <ToastContainer toastMessageFactory={ToastMessageFactory}
              ref={(element) => this.toastContainer = element} className="toast-top-right" />
          </Col>
        </Row>
        <Row className="show-grid m-b-10">
          { !this.state.missionId &&
            <Col xs={6} md={6}>
              <Form horizontal>
                <TextInput name="Name" placeholder="Enter mission name" onValid={this.onValidMissionName.bind(this)} />
                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Button type="submit" bsSize="small" onClick={this.save}>Save</Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          }
          <Col xs={6} md={6} className="pull-right">
            <ButtonToolbar className="pull-right">
              {this.state.missionId && <Button type="submit" bsSize="small" onClick={this.save}>Update</Button>}
              <Button bsSize="small" onClick={this.clearAll}>Clear All</Button>
              <a type="button" className="btn btn-sm btn-default" href="#/list">List All missions</a>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row className="map-container-wrapper">
          <Col xs={12} md={12}>
            <MissionPointList missionItems={this.state.missionItems} onMissionItemCancel={this.handleMissionItemCancel} onMissionItemSave={this.handleMissionItemSave} onMissionItemDelete={this.handleMissionItemDelete} openedListItems={this.state.openedMissionItems} onPanelHeaderClick={this.handleMissionItemHeaderClick} />
            <MissionMap missionItems={this.state.missionItems} onMapClick={this.handleMapClick} onMarkerClick={this.handleMarkerClick} loaded={this.props.loaded} centerOnUpdate={this.state.centerMapOnUpdate} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default MissionPlanner;
