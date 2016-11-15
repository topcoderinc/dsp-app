import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionPlannerEdit from '../MissionPlannerEdit';

describe('MissionPlannerEdit Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<MissionPlannerEdit
        id={''}
        auth={{}}
        loaded={true}
      />);
  });

});