module.exports = {

    'facebookAuth': {
        'clientID': process.env.FACEBOOK_AUTH_APP_ID, // your App ID
        'clientSecret': process.env.FACEBOOK_AUTH_SECRET, // your App Secret
        'callbackURL': 'https://prediga2.herokuapp.com/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    },

    'facebookAuth-local': {
        'clientID': '1671729896222419', // your App ID
        'clientSecret': 'd8d2b0cc52b5edd76dd8ef9249f99f46', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    },

    'googleAuth': {
        'clientID': process.env.GOOGLE_AUTH_APP_ID, // your App ID
        'clientSecret': process.env.GOOGLE_AUTH_SECRET, // your App Secret
        'callbackURL': 'https://prediga2.herokuapp.com/auth/google/callback'
    },

    'googleAuth-local': {
        'clientID': '18291130688-f7vq5k6br6vvuptcgf58d6lg27og5g7h.apps.googleusercontent.com', // your App ID
        'clientSecret': 'yHK3hcOeAuctiHR4BNv4TOsR', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }

};
