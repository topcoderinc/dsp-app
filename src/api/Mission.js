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
 * MissionApi consumer, full implement the rest contract
 */
class MissionApi {
  /**
   * Default Constructor
   * @param  {String}   basePath      the base API path
   */
  constructor(basePath, auth) {
    this.basePath = basePath;
    this.auth = auth;
  }

  getAll() {
    const url = `${this.basePath}/api/v1/missions`;

    return reqwest({ url: url, method: 'get', headers: this.auth.getHeader() });
  }

  getSingle(id) {
    const url = `${this.basePath}/api/v1/missions/${id}`;

    return reqwest({ url: url, method: 'get', headers: this.auth.getHeader() });
  }

  save(name, items, homePosition) {
    const url = `${this.basePath}/api/v1/missions`;

    return reqwest({ url: url, method: 'post', type: 'json',
      contentType: 'application/json',
      headers: this.auth.getHeader(),
      data: JSON.stringify({
        plannedHomePosition: homePosition,
        missionItems: items,
        missionName: name,
      })});
  }

  update(id, name, items, homePosition) {
    const url = `${this.basePath}/api/v1/missions/${id}`;

    return reqwest({ url: url, method: 'put', type: 'json',
      contentType: 'application/json',
      headers: this.auth.getHeader(),
      data: JSON.stringify({
        plannedHomePosition: homePosition,
        missionItems: items,
        missionName: name,
      })});
  }

  download(id) {
    const url = `${this.basePath}/api/v1/missions/${id}/download`;

    return reqwest({ url: url, method: 'get', headers: this.auth.getHeader() });
  }

  delete(id) {
    const url = `${this.basePath}/api/v1/missions/${id}`;

    return reqwest({ url: url, headers: this.auth.getHeader(), method: 'delete' });
  }
}

export default MissionApi;
