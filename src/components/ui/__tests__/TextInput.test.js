import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils'

import TextInput from '../TextInput';

describe('TextInput Component', function () {

  it('renders without crash', () => {
    let shallowRenderer = ReactTestUtils.createRenderer();
    let component = shallowRenderer.render(<TextInput
        name=''
        placeholder=''
        onValid={function(){}}
      />);
  });

});