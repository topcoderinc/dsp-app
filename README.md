react-app
---

# Local Deployment
Copy `envSample` as `.env`.
Install node dependencies using `npm install`
Run the development server using `npm run start`

# Local Configuration Variables
You can edit them in `.env` file.

# Heroku Deployment
```
git init
git add .
git commit -m "react-create-app on Heroku"
# make sure commit all codes and usuaully you do not need to run above command if you are sure your codes in git repo is latest.
heroku create -b https://github.com/mars/create-react-app-buildpack.git
# set variables defined in .env
heroku config:set REACT_APP_API_BASE_PATH=base url
heroku config:set REACT_APP_SOCKET_URL=socket url
heroku config:set REACT_APP_AUTH0_CLIEND_ID=auth0 client id
heroku config:set REACT_APP_AUTH0_DOMAIN=auth0 domain
heroku config:set REACT_APP_GOOGLE_API_KEY=google api key
git push heroku HEAD:master
heroku open
```

You can use new configuration with below commands from [set-vars-on-heroku](https://github.com/mars/create-react-app-buildpack#set-vars-on-heroku).
```
heroku config:set REACT_APP_API_BASE_PATH=new base url
git commit --allow-empty -m "Set REACT_APP_API_BASE_PATH config var"
git push heroku HEAD:master
```

