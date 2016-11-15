import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import MissionList from '../MissionList';

describe('MissionList Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<MissionList
        auth={{}}
        loaded={true}
      />);
  });

});