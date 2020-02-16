module.exports = {
    'googleAuth': {
        'clientID': process.env.GOOGLE_AUTH_APP_ID, // your App ID
        'clientSecret': process.env.GOOGLE_AUTH_SECRET, // your App Secret
        'callbackURL': 'https://prediga2.herokuapp.com/auth/google/callback'
    },

    'googleAuth-local': {
        'clientID': '285536628918-23im045uvk9am22270tq9ojuk0mfrin8.apps.googleusercontent.com', // your App ID
        'clientSecret': 'O0vqFaLKtaCi_YX2YWVdJaDi', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }

};
