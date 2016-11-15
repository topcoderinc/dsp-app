import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import EmailInput from '../EmailInput';

describe('EmailInput Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<EmailInput
        onValid={function(){}}
      />);
  });

});