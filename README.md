# PrediGa v2.0
Prediction game using MEAN stack

## Prerequisites
1. Install mongodb: `https://docs.mongodb.com/manual/installation/`
2. Run: `mongod.exe`

## Instructions
1. Install: `npm install`
2. Launch: `node server.js`
3. Visit: `http://localhost:3000`

## Add admin user
1. Run mongo shell: `mongo.exe`
2. Switch to Prediga DB: `use prediga`
3. Find user: `db.users.find({"name": "Gilad Keinan"})`
4. Update roles: `db.users.update({"name": "Gilad Keinan"}, { $set: {"roles": ["admin"]}})` 

## Using Test Users
- email: `nhrkrkbdms_1510943227@tfbnw.net`
- password: `qwerasdfzxcv`