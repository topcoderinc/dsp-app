/**
 * Copyright (c) 2016 Topcoder Inc, All rights reserved.
 */

/**
 * Webapp configuration
 *
 * @author       TCSCODER
 * @version      1.0.0
 */

const config = {
  api: {
    basePath: process.env.REACT_APP_API_BASE_PATH,
  },
  socket: {
    url: process.env.REACT_APP_SOCKET_URL,
  },
  google: {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
  },
  AUTH0_CLIEND_ID: process.env.REACT_APP_AUTH0_CLIEND_ID,
  AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN,
};

export default config;
