// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '2602886083085853', // your App ID
        'clientSecret': 'd3aac3a44a7a1014e2cbaded1984d931', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'name', 'gender', 'email', 'photos']
    }

};
