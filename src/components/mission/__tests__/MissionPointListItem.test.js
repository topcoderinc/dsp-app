import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionPointListItem from '../MissionPointListItem';

describe('MissionPointListItem Component', function () {

  it('renders without crash', () => {
    let component = ReactTestUtils.renderIntoDocument(<MissionPointListItem
        key={'0'}
        missionItemIndex={0}
        missionItem={{
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
        }}
        onCancel={function(){}}
        onSave={function(){}}
        onDelete={function(){}}
        onPanelHeaderClick={function(){}}
        isOpened={false}
      />);
  });

});