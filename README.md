react-app
---

# Local Deployment
- Copy `envSample` as `.env` and configure variables described in section below
- Install node dependencies using `npm install`
- Run the development server using `npm run start`
- `http://localhost:3000` should be opened in the browser after succesfull server run


# Local Configuration Variables
You can edit them in `.env` file.
- Set `REACT_APP_GOOGLE_API_KEY` to google API key which can be obtained [here](https://console.developers.google.com/flows/enableapi?apiid=maps_backend%2Cgeocoding_backend%2Cdirections_backend%2Cdistance_matrix_backend%2Celevation_backend%2Cplaces_backend&reusekey=true)
- Set `REACT_APP_AUTH0_CLIEND_ID` and `REACT_APP_AUTH0_DOMAIN` which can be obtained at [Auth0](https://auth0.com/)

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
