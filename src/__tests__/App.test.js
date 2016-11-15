
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import App from '../App';

describe('App Component', function () {

  it('renders without crash', () => {
    let component = ReactTestUtils.renderIntoDocument(<App
        auth={{
            logout: function(){},
            loggedIn: function(){}
        }}
        isScriptLoaded={false}
        isScriptLoadSucceed={false}
      />);
  });

});