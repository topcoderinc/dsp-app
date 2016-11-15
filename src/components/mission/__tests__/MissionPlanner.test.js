import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionPlanner from '../MissionPlanner';

describe('MissionPlanner Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<MissionPlanner
        auth={{}}
        loaded={true}
      />);
  });

});