var request = require('request');
module.exports = function (object, settings, callback) {
  //create a url out of the object
  var url = settings.url + '?' + Object.keys(object).map(function(key) {
    return key + '=' + object[key];
  }).join('&');
  var result = {
    T : object.T,
    queryExecutionTime : 0,
    httpRequests : 1,
    connections : ""
  };
  //fire the url
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var path = JSON.parse(body);
      result.journeyTime = (new Date(path[path.length-1].arrivalTime) - new Date(path[0].departureTime))/60000;
    } else {
      if (error) {
        result.error = error;
      } else {
        result.error = "Did not give a response: " + response.statusCode;
      }
    }
    callback(result);
  });
};
