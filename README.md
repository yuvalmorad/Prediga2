# PrediGa v2.0
Prediction game using MongoDB, ExpressJS, NodeJS, ReactJS

## Prerequisites
1. Install mongodb: `https://docs.mongodb.com/manual/installation/`
2. Run: `mongod.exe`

## Instructions
1. Install: `npm install`
2. Launch: `node server.js`
3. Visit: `http://localhost:3000`

## Add admin user
1. Run mongo shell: `mongo.exe`
2. Switch to Prediga DB: `use prediga;`
3. Find user: `db.users.find({"name": "Gilad Keinan"})`
4. Update roles: `db.users.update({"name": "Gilad Keinan"}, { $set: {"roles": ["admin"]}})` 
5. To drop all content: `db.dropDatabase();`

## Using Test Users
- email: `nhrkrkbdms_1510943227@tfbnw.net`
- password: `qwerasdfzxcv`

## Copy DB from heroku to localhost:
1. Get the config vars from Heroku with:
  heroku config --app <appname>
( heroku config --app prediga2 )
Find the MONGOLAB_URI value. It will be in the form of: mongodb://<username>:<password>@<url>:<port>/<database>

2. Run the following command to make a copy of the production database to your local working directory:
 Use the values from the config file: 
  mongodump -h <url>:<port> -d <database> -u <username> -p <password>
( mongodump -h ds113136.mlab.com:13136 -d heroku_lx301k46 -u heroku_lx301k46 -p 8dfj5o98t7a87n9iicm6t5kdbi )
mongodump will create the following directory to store the data: dump/<database>/

3. Make sure your local instance of mongod is running.

4. Drop your existing local database with the following command:
  mongo <dbname> --eval "db.dropDatabase()"
( mongo localhost:27017/prediga --eval "db.dropDatabase()" )

5. Use mongorestore to put the prod data into your local mongodb.
  mongorestore -d <dbname> dump/<database>/
( mongorestore -d localhost:27017/prediga dump/heroku_lx301k46 )