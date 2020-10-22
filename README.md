# PrediGa v2.0
Prediction game using MongoDB, ExpressJS, NodeJS, ReactJS

## Prerequisites
1. brew tap mongodb/brew
2. brew install mongodb-community@4.2 
3. Install dependencies: run `npm install`

## Lunch game
1. brew services start mongodb-community@4.2
2. Launch: `node server.js`
   * Put the following application arguments
   * WEB_PUSH_PUBLIC_KEY=BAdXhdGDgXJeJadxabiFhmlTyF17HrCsfyIj3XEhg1j-RmT2wXU3lHiBqPSKSotvtfejZlAaPywJ9E
   * WEB_PUSH_PRIVATE_KEY=VCgMIYe2BnuNA4iCfR94hA6pLPT3u3ES1n1xOTrmyLw    
   * WEB_PUSH_MAIL_TO = mailto:example_email@example.com
3. Visit: http://localhost:3000
4. At the end stop mongo `brew services start mongodb-community@4.2`

## Mongo shell
### localhost
mongo localhost:27017/prediga  
show collections  
db.getCollection("matches").find()  

### remote 
mongo "mongodb+srv://cluster0.xp0co.mongodb.net/prediga" --username admin --password EZhnhzKULVu1jAcs

### Copy DB from heroku to localhost:
mongodump --uri mongodb+srv://admin:EZhnhzKULVu1jAcs@cluster0.xp0co.mongodb.net/prediga  
mongo localhost:27017/prediga --eval "db.dropDatabase()"  
mongorestore -d prediga dump/heroku_9tqmxnlw  

## Monkeys
Gunner: prediga.monkey.1234@gmail.com   
Striker: prediga.monkey.12345@gmail.com  
then updates in utils.js the user ids.
  
## reset leaderboard
GET /api/usersLeaderboard/reset/1a21a7c1a3f89181074e9769