# PrediGa v2.0
Prediction game using MongoDB, ExpressJS, NodeJS, ReactJS

## Prerequisites
1. brew tap mongodb/brew
2. brew install mongodb-community@4.2 
3. Install dependencies: `npm install`

## Lunch game
1. brew services start mongodb-community@4.2
2. Launch: `node server.js`
   * Put the following application arguments
   * WEB_PUSH_PUBLIC_KEY=BAdXhdGDgXJeJadxabiFhmlTyF17HrCsfyIj3XEhg1j-RmT2wXU3lHiBqPSKSotvtfejZlAaPywJ9E
   * WEB_PUSH_PRIVATE_KEY=VCgMIYe2BnuNA4iCfR94hA6pLPT3u3ES1n1xOTrmyLw    
   * WEB_PUSH_MAIL_TO = mailto:example_email@example.com
   
3. Visit: `http://localhost:3000`

## Add admin user
1. Run mongo shell: `mongo.exe`
2. Switch to Prediga DB: `use prediga;`
3. Find user: `db.users.find({"name": "Gilad Keinan"})`
4. Update roles: `db.users.update({"name": "Gilad Keinan"}, { $set: {"roles": ["admin"]}})` 
5. To drop all content: `db.dropDatabase();`

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