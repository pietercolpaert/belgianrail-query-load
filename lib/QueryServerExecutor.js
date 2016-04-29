var request = require('request');
module.exports = function (object, settings, callback) {
  //create a url out of the object
  var url = settings.url + '?' + Object.keys(object).map(function(key) {
    return key + '=' + object[key];
  }).join('&');
  var result = {
    T : object.T,
    httpRequests: 1
  };
  //fire the url
  request(url, function (error, response, body) {
    result.httpTotalBytes = response.headers['content-length'];
    if (!error && response.statusCode == 200) {
      var responseObject = JSON.parse(body);
      var path = responseObject['@graph'];
      result.connectionsProcessed = responseObject.connectionsProcessed;
      result.connectionsMST = responseObject.connectionsMST;
      result.journeyTime = (new Date(path[path.length-1].arrivalTime) - new Date(path[0].departureTime))/60000;
    } else {
      result = "";
      if (error) {
        console.error(error);
      } else {
        console.error("Did not give a response: " + response.statusCode);
      }
    }
    if (!result.journeyTime) {
      console.error("No answer found for", object);
      result = "";
    }
    callback(result);
  });
};
