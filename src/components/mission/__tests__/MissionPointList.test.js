import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionPointList from '../MissionPointList';

import _ from 'lodash';

const missionItem = {
  keyId: '0',
  id: 0,
  autoContinue: true,
  command: 16,
  coordinate: [0, 0, 0],
  frame: 3,
  param1: 0.000000,
  param2: 0.000000,
  param3: 0.000000,
  param4: 0.000000,
  type: 'missionItem'
}

const missionItems = [0, 1, 2, 3].map((missionItemIndex) => {
  return _.extend({}, missionItem, {
    keyId: missionItemIndex + '',
    id: missionItemIndex,
    command: missionItemIndex === 1 ? 22 : 16
  })
});

describe('MissionPointList Component', function () {

  it('renders without crash', () => {
    let component = ReactTestUtils.renderIntoDocument(<MissionPointList
        missionItems={missionItems}
        onMissionItemCancel={function(){}}
        onMissionItemSave={function(){}}
        onMissionItemDelete={function(){}}
        openedListItems={[]}
        onPanelHeaderClick={function(){}}
      />);
  });

});