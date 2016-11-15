import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import Login from '../Login';

describe('Login Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<Login
        auth={{
            setToken: function(){},
            login: function(){}
        }}
      />);
  });

});