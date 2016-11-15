
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import GoogleApiComponent from '../GoogleApiComponent';

describe('GoogleApiComponent Component', function () {

  it('renders without crash', () => {
    let component = ReactTestUtils.renderIntoDocument(<GoogleApiComponent
        loaded={false}
      />);
  });

});