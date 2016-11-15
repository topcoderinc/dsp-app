
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import GoogleMap from '../GoogleMap';

describe('GoogleMap Component', function () {

  it('renders without crash', () => {
    let component = ReactTestUtils.renderIntoDocument(<GoogleMap
        loaded={false}
      />);
  });

});