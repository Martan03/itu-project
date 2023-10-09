# ITU Project

## Backend

To run the server, go to the `backend` directory and run:
```
node index.js
```
The server runs on `localhost:3002`

### Database

Server connects to the database (you can edit connection details in
`/backend/config/db.js`), so you need run database server. (you may need
to install `xampp` for example or any other tool).

I created a temporary API endpoint to create database tables
(`/api/create-tables`), so you don't have to create them by your own.

To find out more about API, check out `README.md` in `backend` folder

## Frontend

To run the frontend, go to the `frontend` directory and run:
```
npm start
```
It should automatically open new window in the browser.
