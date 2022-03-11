const User = require("../models/user")
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')


// INDEX: GET
// /users
// Gives a page displaying all the users
router.get('/login', (req, res) => {
    res.render('login.ejs')
})
// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        // get user from database that matches username
        const possibleUser = await User.findOne({ username: req.body.username })
        if (possibleUser) {
            // there is a user with this username
            // compare this password with password from database
            // if (possibleUser.password === req.body.password) {
            // now with bcrypt we have to change line above to
            if (bcrypt.compareSync(req.body.password, possibleUser.password)) {
                // its a match
                req.session.isLoggedIn = true;
                // tracking who is logged in!! we will reference this id multiple places
                req.session.userId = possibleUser._id;
                // redirect to main page or user home page/dashboard
                res.redirect('/recipes')
            } else {
                res.redirect('/users/login')
            }
        } else {
            //    Let them try again
            res.redirect('/users/login')
        }
    }
    catch (err) {
        console.log(err)
        res.send(500)
    }
});
// LOGOUT ROUTE
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
});

// activate session code
router.get('/', async (req, res) => {
    const users = await User.find({ username: req.query.username });
    res.render('users/home.ejs', {
        users: users
    });
});

// NEW: GET
// /users/new
// Shows a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

// SHOW: GET
// /users/:id
// Shows a page displaying one user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render("users/show.ejs", {
        user: user
    })
})

// CREATE: POST
// /users
// Creates an actual user, then...?
router.post('/', async (req, res) => {
    //  req.body.password needs to be hashed
    console.log(req.body)
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    req.body.password = hashedPassword
    const newUser = await User.create(req.body);
    console.log(newUser)
    res.redirect('/users')
})
// could technically do this, this is unpacking pswd
// const userToCreate = {
// ...req.body,
// password: hashedPassword
// }

// EDIT: GET
// /users/:id/edit
// SHOW THE FORM TO EDIT A user
router.get('/:id/edit', async (req, res) => {
    try {
        if (req.session.userId === req.params.id) {
            const user = await User.findById(req.params.id)
            res.render('users/edit.ejs', {
                user: user
            })
        } else {
            throw new Error("You're not that user!")
        }
    } catch (err) {
        res.sendStatus(500)
    }
});

// UPDATE: PUT
// /users/:id
// UPDATE THE USER WITH THE SPECIFIC ID
router.put('/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        res.sendStatus(500)
    }
})

// DELETE: DELETE
// /users/:id
// DELETE THE USER WITH THE SPECIFIC ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.redirect('/users')
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router;