module.exports = {

    'facebookAuth': {
        'clientID': process.env.FACEBOOK_AUTH_APP_ID, // your App ID
        'clientSecret': process.env.FACEBOOK_AUTH_SECRET, // your App Secret
        'callbackURL': 'https://prediga2.herokuapp.com/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    },

    'facebookAuth-Test': {
        'clientID': '1671729896222419', // your App ID
        'clientSecret': 'd8d2b0cc52b5edd76dd8ef9249f99f46', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    }

};
