/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};

  profile.username = json.response.username

  if (json.response.email) {
    profile.email = json.response.email
  }
  if (json.response.level) {
    profile.level = json.response.level
  }
  if (json.response.xp) {
    profile.xp = json.response.xp
  }

  return profile;
};
