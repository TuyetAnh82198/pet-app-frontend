**I. Project introduction**
The website is used to manage pets.
Frontend: React, Bootstrap, (folder context and useReducer just for testing and practicing), link: https://github.com/TuyetAnh82198/pet-app-frontend
Backend: NodeJS, Express, Socket.IO, link: https://github.com/TuyetAnh82198/pet-app-backend
Database: MongoDB
Performance optimization: useCallback, Compression
Language: English

**II. Functional description**
Add/edit/delete pet data.
Add dog breed or cat breed; show all breed.
Input value validation.
Show all pets or healthy pets only.
BMI calculator (round to the second decimal place).
Export pet data.
Search for pets.
Animation sidebar.

**III. Demo link**
https://pet-app-frontend-c7wd.onrender.com
*Recommended browser: Google Chrome

**IV. Deployment guide (on local)**

1. We need to install NodeJS 

2. Frontend:
npm start (localhost 3000) 
.env: REACT_APP_BACKEND, REACT_APP_FRONTEND

3. Backend:
npm start (localhost 5000)
nodemon.json:
{
  "env": {
    "CLIENT_APP": "for example http://localhost:3000",
    "MONGO_USER": "",
    "MONGO_PASS": "",
  }
}
And then update scripts in package.json, for example:
"start": "NODE_ENV=development CLIENT_APP=http://localhost:3000 MONGO_USER=abc MONGO_PASS=xyz nodemon app.js"
