var Settings = require('settings');
var ajax = require('ajax');

var get = function(opts, callback, errorCallback) {
  var auth = JSON.parse(Settings.option('auth'));

  if (Date.now() >= Settings.option('exiresAt')) {
    console.log('refreshing');
    ajax({
      url: 'https://mendeley-pebble.herokuapp.com/auth/refresh?refresh_token=' + auth.refresh_token,
      type: 'json'
    }, function(data) {
      Settings.option('auth', data);
      
      data = JSON.parse(data);
      
      var expiresAt = Date.now() + (data.exires_in * 1000);
      Settings.option('exiresAt', expiresAt);
      
      get(opts, callback, errorCallback);
    });
  } else {
    console.log('api request', opts.url);
    opts.headers.Authorization = 'Bearer ' + auth.access_token;
    opts.type = 'json';
    ajax(opts, callback, errorCallback);
  }
};

module.exports = {
  get: get
};