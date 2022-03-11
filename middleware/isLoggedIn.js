module.exports = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next()
    } else {
        res.render('users/login.ejs')
    }
};