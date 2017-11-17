module.exports = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },

    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.hasRole('admin')) {
            return next();
        } else {
            res.status(403).json({});
        }
    }
};