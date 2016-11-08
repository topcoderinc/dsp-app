/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * A simple implementation of /missions API contract
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import reqwest from 'reqwest';

/**
 * UserApi consumer, full implement the rest contract
 */
class UserApi {
  /**
   * Default Constructor
   * @param  {String}   basePath      the base API path
   */
  constructor(basePath) {
    this.basePath = basePath;
  }

  login(email, password) {
    const url = `${this.basePath}/api/v1/users/auth`;

    return reqwest({ url: url, method: 'post', type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        email: email,
        password: password,
      })});
  }

  register(name, email, password) {
    const url = `${this.basePath}/api/v1/users`;

    return reqwest({ url: url, method: 'post', type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: name,
        email: email,
        password: password,
      })});
  }
}

export default UserApi;
