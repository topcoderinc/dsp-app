/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * A simple implementation of /drones API contract
 *
 * @author       TCSCODER
 * @version      1.0.0
 */
import reqwest from 'reqwest';

/**
 * DroneApi consumer, full implement the rest contract
 */
class DroneApi {
  /**
   * Default Constructor
   * @param  {String}   basePath      the base API path
   */
  constructor(basePath) {
    this.basePath = basePath;
  }

  getAll() {
    const url = `${this.basePath}/api/v1/drones`;

    return reqwest({ url: url });
  }
}

export default DroneApi;
