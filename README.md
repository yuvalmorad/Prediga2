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
- Get the config vars from Heroku with:  
 `heroku config --app <appname>`  
 e.g. `heroku config --app prediga2`  
Find the `MONGOLAB_URI` value. It will be in the form of: `mongodb://<username>:<password>@<url>:<port>/<database>`

- Run the following command to make a copy of the production database to your local working directory.  
 mongodump will create the following directory to store the data: dump/<database>  
 Use the values from the config file:     
`mongodump -h <url>:<port> -d <database> -u <username> -p <password>`  


- Make sure your local instance of mongod is running.

- Drop your existing local database with the following command:  
`mongo localhost:27017/prediga --eval "db.dropDatabase()"`

- Use mongorestore to put the prod data into your local mongodb.  
`mongorestore --host <host> --port <port> --db <dbname> <dumpPath>`

e.g. `mongorestore -d prediga dump/heroku_lx301k46`