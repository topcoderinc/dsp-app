react-app
---

# Local Deployment
Copy `envSample` as `.env`.
Install node dependencies using `npm install`
Run the development server using `npm run start`

# Local Configuration Variables
You can edit them in `.env` file.

# Heroku Deployment
Make sure your variables are defined in .env first.

Install the heroku config plugin:
```
heroku plugins:install heroku-config```

```
git init
git add .
git commit -m "react-create-app on Heroku"
# make sure commit all codes and usually you do not need to run above command if you are sure your codes in git repo is latest.

heroku create
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/mars/create-react-app-buildpack.git

# set variables defined in .env
heroku config:push

git push heroku HEAD:master
heroku open
```

You can use new configuration with below commands from [set-vars-on-heroku](https://github.com/mars/create-react-app-buildpack#set-vars-on-heroku).
```
heroku config:set REACT_APP_API_BASE_PATH=new base url
git commit --allow-empty -m "Set REACT_APP_API_BASE_PATH config var"
git push heroku HEAD:master```
