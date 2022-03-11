const mongoose = require("mongoose");
// Configuration
const mongodb = 'mongodb://localhost:27017/recipe' ;
const db = mongoose.connection(mongodb, {useNewUrlParser:true, useUnifiedTopology:true});
// Connect to Mongo
mongoose.connect(process.env.MONGO_URI);

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGO_URI));
db.on('disconnected', () => console.log('mongo disconnected'));