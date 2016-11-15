import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import Signup from '../Signup';

describe('Signup Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<Signup
      />);
  });

});