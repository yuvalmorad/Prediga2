module.exports = {

    'facebookAuth': {
        'clientID': '2602886083085853', // your App ID
        'clientSecret': 'd3aac3a44a7a1014e2cbaded1984d931', // your App Secret
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
