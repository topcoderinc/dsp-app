import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionListItem from '../MissionListItem';

describe('MissionListItem Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<MissionListItem
        mission={{
          id: '0',
          missionName: ''
        }}
        key={'0'}
        auth={{getToken: function(){}}}
        refresh={function(){}}
      />);
  });

});