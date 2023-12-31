# ITU Project

## Backend

To run the server, go to the `backend` directory and run:
```
node index.js
```
The server runs on `localhost:3002`

If error with missing package is encountered, install missing package in `backend` directory:
```
npm install
```
This should install all required packages for the Backend section.

### Database

In order to run the app, you need to host database server.

We ran the database using [xampp](https://www.apachefriends.org/download.html).
After installing, you can start the server on linux using
`sudo /opt/lampp/lampp start` (replace the address with address, where you
saved xampp).

Next step is to create the database. You can go to
```localhost/phpmyadmin``` page, where you can create it. The database
must be called `trip_planner`. If you want to change database connection
details, you can edit it in `/backend/config/db.js`. This is all you need to do
for setting up the database for now.

Before doing following step, you need to run the server (described in
[backend section](#backend)).

I created a temporary API endpoint to create database tables and fill them with
basic data (`/api/fill-tables`), so you don't have to create them by your own
and fill them with the data. This is for testing only and should be removed
after the development. In order to use it, run following ```localhost:3002/api/fill-tables```.

To find out more about API, check out `README.md` in `backend` folder

## Frontend

Make sure following packages are installed:
```
react-switch (https://github.com/markusenglund/react-switch)
react-slider (https://github.com/zillow/react-slider)
react-scripts (https://github.com/facebook/create-react-app)
react-router-dom (https://github.com/remix-run/react-router)
react-big-calendar (https://github.com/jquense/react-big-calendar)
js-cookie (https://github.com/js-cookie/js-cookie)
maplibre-gl (https://github.com/maplibre/maplibre-gl-js)
moment (https://github.com/moment/moment)
```

If not, again use `npm install` to install them all-in-one into project's `frontend` directory.

To run the frontend, go to the `frontend` directory and run:
```
npm start
```
It should automatically open new window in the browser.
