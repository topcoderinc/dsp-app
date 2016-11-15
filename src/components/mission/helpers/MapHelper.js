/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Helper functions
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
 import circleGreen from '../../../i/circle_cubs.svg';

 /**
  * Clear all markers (waypoints)
  * @param  {Object}     _self             the 'this' object
  */
 function clearAll(_self) {
   _self.poly.setMap(null);
   _self.poly = null;
   _self.state.markers.forEach((single) => {
     single.setMap(null);
   });
   _self.setState({ markers: [], missionItems: [], idSequence: 0 });
 }

 /**
  * Save/Update mission
  * @param  {Object}     event             the event
  * @param  {Object}     _self             the 'this' object
  * @param  {Boolean}    isNew             true if should save/false if should update mission
  * @param  {Object}     hashHistory       the 'hashHistory' object
  */
 function save(event, _self, isNew, hashHistory) {
   event.preventDefault();
   if (_self.state.missionItems.length === 0) {
     _self.toastContainer.warning('',
       'Add some waypoints before saving a mission', {
       timeOut: 3000,
       preventDuplicates:true
     });
   } else if (!_self.state.missionName) {
     _self.toastContainer.warning('',
       'Enter a mission name', {
       timeOut: 3000,
       preventDuplicates:true
     });
   } else {
     if (isNew) {
       // save the mission
       _self.missionApi.save(_self.state.missionName, _self.state.missionItems, _self.state.plannedHomePosition).then(() => {
         _self.toastContainer.success('',
         'Mission saved', {
           timeOut: 1000,
           preventDuplicates:false
         });
         setTimeout(() => {
           hashHistory.push('/list');
         }, 2000);
       });
     } else {
       // update the mission
       _self.missionApi.update(_self.props.missionId, _self.state.missionName, _self.state.missionItems, _self.state.plannedHomePosition).then(() => {
         _self.toastContainer.success('',
         'Mission updated', {
           timeOut: 1000,
           preventDuplicates:false
         });
         setTimeout(() => {
           hashHistory.push('/list');
         }, 2000);
       });
     }
   }
 }

 /**
  * Handle the mission item update fired from info window component
  * @param  {Object}     _self             the 'this' object
  * @param  {Number}     id                the id of mission item in mission items array
  * @param  {Object}     missionItem       the updated mission item
  */
 function handleMissionItemUpdate(_self, id, missionItem) {
   if (id === 0) {
     _self.setState({ plannedHomePosition: missionItem });
   } else {
     const missionItems = _self.state.missionItems;
     missionItems.splice(id - 1, 1, missionItem);
     _self.setState({ missionItems: missionItems });
   }
 }

 /**
  * Attach the click event on marker and handle the click event on the marker
  *
  * @param  {Object}     _self             the 'this' object
  * @param   {object}       event          the propogated event
  */
 function handleMarkerClick(_self, marker) {
   marker.addListener('drag', (event) => {
     initPolyline(_self);
     const id = marker.get('id') - 1;
     if (id > 0) {
       const curMissionItems = _self.state.missionItems;
       curMissionItems[id].coordinate[0] = marker.getPosition().lat();
       curMissionItems[id].coordinate[1] = marker.getPosition().lng();
     } else {
       const plannedHomePosition = _self.state.plannedHomePosition;
       plannedHomePosition.coordinate[0] = marker.getPosition().lat();
       plannedHomePosition.coordinate[1] = marker.getPosition().lng();
     }
   });
   marker.addListener('dragstart', (event) => {
     _self.canAddNewPoint = false;
   });
   marker.addListener('dragend', (event) => {
     _self.canAddNewPoint = true;
   });
 }

/**
 * Add new marker (waypoint)
 *
 * @param   {Object}     _self             the 'this' object
 * @param   {object}     latLng            the coordinates object
 * @param   {Number}     alt               the altitude
 */
 function addPoint(_self, latLng, alt) {
   const google = window.google;
   initPolyline(_self);
   const path = _self.poly.getPath();
   const markers = _self.state.markers;
   let idSequence = _self.state.idSequence;
   const markerOpts = getMarkerOpts(_self, idSequence, latLng.lat(), latLng.lng());
   const marker = new google.maps.Marker(markerOpts);
   marker.set('id', idSequence);
   const missionItems = _self.state.missionItems;
   const missionItem = getMissionItem(idSequence, latLng.lat(), latLng.lng(), alt);
   if (idSequence !== 0) {
     // if id sequence is 0 than it is home point, so home point is not added to mission items.
     missionItems.push(missionItem);
   } else {
     _self.setState({ plannedHomePosition: missionItem });
   }
   idSequence += 1;
   handleMarkerClick(_self, marker);
   markers.push(marker);
   _self.setState({ markers: markers, idSequence: idSequence, missionItems: missionItems });
   if (idSequence !== 1) {
     path.push(latLng);
   }
 }

/**
 * Delete single marker (waypoint)
 *
 * @param   {Object}     _self             the 'this' object
 * @param   {Number}     id                the index of the marker (waypoint) to delete
 */
 function deleteWaypoint(_self, id) {
   const markers = _self.state.markers;
   const missionItems = _self.state.missionItems;
   markers[id].setMap(null);
   markers.splice(id, 1);
   missionItems.splice(id - 1, 1);
   for (let i=0;i<markers.length;i++) {
     markers[i].set('id', i);
     markers[i].set('label', {
       color: '#759e57',
       text: i === 0 ? 'H' : i === 1 ? 'T' : i,
       fontWeight: '800'
     });
   }
   _self.setState({idSequence: _self.state.idSequence-1});
   _self.setState({markers: markers, missionItems: missionItems});
   initPolyline(_self);
 }

/**
 * Draw Polyline on the map
 *
 * @param   {Object}     _self             the 'this' object
 */
 function initPolyline(_self) {
   const google = window.google;
   const locations = [];
   for (let i=1;i<_self.state.markers.length;i++) {
     locations.push(_self.state.markers[i].getPosition());
   }
   if (_self.poly) _self.poly.setMap(null);
   _self.poly = new google.maps.Polyline({
     path: locations,
     strokeColor: '#ff794d',
     strokeOpacity: 1.0,
     strokeWeight: 2
   });
   _self.poly.setMap(_self.map);
 }

/**
 * Create marker options object
 *
 * @param   {Object}     _self             the 'this' object
 * @param   {Number}     idSequence        the marker id (index)
 * @param   {Number}     lat               the latitude
 * @param   {Number}     lng               the longitude
 */
 function getMarkerOpts(_self, idSequence, lat, lng) {
   const google = window.google;
   const markerOpts = {
     position: new google.maps.LatLng(lat, lng),
     cursor: 'pointer',
     map: _self.map,
     icon: circleGreen,
     draggable: true
   };
   if (idSequence === 0) {
     // add the home
     markerOpts.label = {
       color: '#759e57',
       text: 'H',
       fontWeight: '800'
     };
   } else if (idSequence === 1) {
     // add the takeoff marker
     markerOpts.label = {
       color: '#759e57',
       text: 'T',
       fontWeight: '800'
     };
   } else {
     // add general waypoint marker
     markerOpts.label = {
       color: '#759e57',
       text: `${idSequence}`,
       fontWeight: '800'
     };
   }
   return markerOpts;
 }

 /**
  * Get mission item object
  *
  * @param   {Number}     idSequence        the marker id (index)
  * @param   {Number}     lat               the latitude
  * @param   {Number}     lng               the longitude
  * @param   {Number}     alt               the altitude
  */
 function getMissionItem(idSequence, lat, lng, alt) {
   if (idSequence !== 0) {
     return {
       autoContinue: true,
       command: idSequence === 1 ? 22 : 16,
       coordinate: [lat, lng, alt],
       frame: 3,
       id: idSequence,
       param1: 0.000000,
       param2: 0.000000,
       param3: 0.000000,
       param4: 0.000000,
       type: 'missionItem'
     }
   }
   return {
     autoContinue: true,
     command: 16,
     coordinate: [lat, lng, alt],
     frame: 0,
     id: idSequence,
     param1: 0.000000,
     param2: 0.000000,
     param3: 0.000000,
     param4: 0.000000,
     type: 'missionItem'
   }
 }

 export const MapHelper = {
   clearAll,
   save,
   handleMissionItemUpdate,
   handleMarkerClick,
   addPoint,
   deleteWaypoint,
   initPolyline,
   getMarkerOpts
 };
