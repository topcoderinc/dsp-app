import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionPlannerCreate from '../MissionPlannerCreate';

describe('MissionPlannerCreate Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<MissionPlannerCreate
        auth={{}}
        loaded={true}
      />);
  });

});