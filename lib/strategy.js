/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , request = require('request');


/**
 * `Strategy` constructor.
 *
 * The Fryd authentication strategy authenticates requests by delegating
 * to Fryd REST API using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Fryd application's client ID
 *   - `clientSecret`  your Fryd application's client secret
 *   - `callbackURL`   URL to which Fryd will redirect the user after granting authorization (the callbackURL must be the same as specified in your Fryd account)
 *
 * Examples:
 *
 *     passport.use(new FrydStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/fryd/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy (options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.fryd.zone/auth/login';
  options.tokenURL = options.tokenURL || 'https://api.fryd.zone/auth/token';

  OAuth2Strategy.call(this, options, verify);

  this.name = 'fryd';
  this._userProfileURL = options.userProfileURL || 'https://api.fryd.zone/api/user';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Fryd using a Post request to the user endpoint
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `username`         the user's Fryd username (always returned)
 *
 * The rest of the parameters are only returned if the user wants them to be accessed
 *
 *   - `email`            the user's Fryd email address
 *   - `level`            the user's Fryd level
 *   - `xp`               the user's Fryd xp
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  request({
    url: 'https://api.fryd.zone/api/user',
    method: 'POST',
    body: JSON.stringify({
      token: accessToken,
    }),
  }, function (err, res, body) {

    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);

    done(null, profile);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
