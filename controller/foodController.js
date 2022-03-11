const Recipe = require("../models/recipe")
const express = require('express');
const router = express.Router();

// INDEX: GET
// /cats
// Gives a page displaying all the recipe
router.get('/', async (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 1;
    } else {
        req.session.visits += 1
    }
    const recipes = await Recipe.find();
    res.locals.visits = req.session.visits;
    res.locals.recipes = recipes;
    res.render('recipes/index.ejs', {
    })
})

// NEW: GET
// /cats/new
// Shows a form to create a new recipe
router.get('/new', (req, res) => {
    res.render('recipes/new.ejs')
})

// SHOW: GET
// /cats/:id
// Shows a page displaying one recipe
router.get('/:id', async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('user')//add populate user to connect cat to user
    res.render('recipes/show.ejs', {
        recipe: recipe
    })
})

// CREATE: POST
// Creates an actual recipe, then...?
router.post('/', async (req, res) => {
    req.body.user = req.session.userId
    const newRecipe = await Recipe.create(req.body);
    console.log(newRecipe)
    res.redirect('/recipes')
})

// EDIT: GET
// /cats/:id/edit
// SHOW THE FORM TO EDIT A recipe
router.get('/:id/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        res.render('recipes/edit.ejs', {
            recipe: recipe
        })
    } catch (err) {
        res.sendStatus(500)
    }
})

// UPDATE: PUT
// /cats/:id
// UPDATE THE recipe WITH THE SPECIFIC ID
router.put('/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`${req.params.id}`)
    } catch (err) {
        res.sendStatus(500)
    }
})
// DELETE: DELETE
// /cats/:id
// DELETE THE CAT WITH THE SPECIFIC ID
router.delete('/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id)
        res.redirect('/recipes')
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router;
