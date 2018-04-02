Passport strategy for authenticating users with a Fryd account, using the OAuth 2.0 API.

You can easily integrate authentication in middleware style applications like Express using Passport. http://passportjs.org/


### Install

`$ npm install passport-fryd`

### Usage

#### Create an Application

To use Fryd's API you have to register an application on Fryd's Website to receive a clientID and clientSecret.

#### Configure Strategy

The Strategy requires a Fryd User to log in with his account and provides a callback with accessToken, refreshToken and the users Profile. The callbackURL has to match the one on Fryd.
User.findOrCreate() is a placeholder for your method of fetching the user or creating a new account with the provided profile information. Fryd always provides a username, but further details are of the users choice (email, xp and level).

```
var FrydStrategy = require('passport-fryd').Strategy;

passport.use(new FrydStrategy({
    clientID: FRYD_CLIENT_ID,
    clientSecret: FRYD_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/fryd/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ username: profile.username }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use passport.authenticate(), specifying the 'fryd' strategy, to authenticate requests.

For example, as route middleware in an Express application:

`app.get('/auth/fryd', passport.authenticate('fryd'));`

```
app.get('/auth/fryd/callback', passport.authenticate('fryd', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

#### Example:

// TODO implement working express example

License

// TODO implement MIT license

Copyright (c) 2017 George Danzer
