// food app info!!
const express = require('express');
const methodOverride = require('method-override')
const User = require('./models/user')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const app = express();
const isLoggedIn = require("./middleware/isLoggedIn")


const mongoose = require("mongoose");
const MONGO_URI = 'mongodb://localhost:27017/' + 'recipe';
const db = mongoose.connection;
const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'mySessions'
});

const foodController = require('./controller/foodController')
const userController = require('./controller/userController')
app.use(express.static("public"))
app.use(methodOverride('_method'))
app.use(require('./middleware/logger'))
// const isLoggedIn = require('./middleware/isLoggedIn')
// app.use(require('./middleware/isLoggedIn'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Connect to Mongo
mongoose.connect(MONGO_URI);

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGO_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// routes are on foodController.js


// NEW SESSION OBJECT
const SESSION_SECRET = "keepitsecretkeepitsafe"
app.use(session({
    secret: "keepitsecretkeepitsafe",
    resave: false,
    saveUninitialized: false,
    store: store
}));

// app.use((req, res, next) => {
//     if (req.session.isLoggedIn) {
//         next()
//     } else {
//         res.render('users/login.ejs')
//     }
// });


app.use(async (req, res, next) => {
    // this will send info from session to templates
    res.locals.isLoggedIn = req.session.isLoggedIn
    if (req.session.isLoggedIn) {
        const currentUser = await User.findById(req.session.userId)
        // set this property, my response will have a local variable called user
        res.locals.username = currentUser.username
        res.locals.userId = req.session.userId.toString()
    }
    next()
})

app.get('/', (req, res) => {
    // direct to homepage of app
    res.render('home.ejs')
})


app.use('/recipes', isLoggedIn, foodController)
app.use('/users', userController)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('app is running')
})
