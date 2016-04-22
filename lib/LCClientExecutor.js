module.exports = function (object, options, callback) {
  options.client.query(object, function (resultStream, source) {
    var result = {
      T : object.T,
      queryExecutionTime : 0,
      httpRequests : 0,
      connections : 0
    };
    source.on('request', function (url) {
      result.httpRequests ++;
    });
    var resultFound = false;
    resultStream.on('result', function (path) {
      resultFound = true;
      result.journeyTime = (path[path.length-1].arrivalTime - path[0].departureTime)/60000;
      source.close();
      callback(result);
    });
    resultStream.on('data', function (data) {
      result.connections++;
    });
    source.on('error', function (e) {
      result.error = e;
    });
    
    resultStream.on('error', function (e) {
      result.error = e;
    });
    resultStream.on('end', function () {
      if (!resultFound) {
        result.error = 'No result found for T' + object.T;
        callback(result);
      }
    });
  });
};
