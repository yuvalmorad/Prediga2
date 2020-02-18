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

## Monkeys
prediga.monkey.1234@gmail.com ==> Gunner  
prediga.monkey.12345@gmail.com ==> Striker  
then updates in utils.js the user ids.

## Add admin user
1. Run mongo shell: `mongo.exe`
2. Switch to Prediga DB: `use prediga;`
3. Find user: `db.users.find({"name": "Gilad Keinan"})`
4. Update roles: `db.users.update({"name": "Gilad Keinan"}, { $set: {"roles": ["admin"]}})` 
5. To drop all content: `db.dropDatabase();`

## Copy DB from heroku to localhost:
mongodump -h ds219839.mlab.com:19839 -d heroku_9tqmxnlw -u heroku_9tqmxnlw -p 70e71ikrg3cu3did8gbja5eokj  
mongo localhost:27017/prediga --eval "db.dropDatabase()"  
mongorestore -d prediga dump/heroku_9tqmxnlw

## reset leaderboard
/api/usersLeaderboard/reset/1a21a7c1a3f89181074e9769