# ITU Project

## Backend

To run the server, go to the `backend` directory and run:
```
node index.js
```
The server runs on `localhost:3002`

If error with missing package is encountered, install missing package in `backend` directory:
```
npm install PACKAGE_NAME
```

### Database

Server connects to the database (you can edit connection details in
`/backend/config/db.js`), so you need run database server (you may need to install `xampp` for example or any other tool).

I created a temporary API endpoint to create database tables
(`/api/create-tables`), so you don't have to create them by your own.

To find out more about API, check out `README.md` in `backend` folder

## Frontend

Make sure following packages are installed:
```
react-switch
react-slider
js-cookie
react
```

Again use `npm install` to install them into project's home directory (above `frontend` and `backend` directories).

To run the frontend, go to the `frontend` directory and run:
```
npm start
```
It should automatically open new window in the browser.
