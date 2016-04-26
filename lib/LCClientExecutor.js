module.exports = function (object, options, callback) {
  options.client.query(object, function (resultStream, done, connectionsStream) {
    var result = {
      T : object.T,
      connectionsMST : 0,
      connectionsProcessed : 0
    };
    var resultFound = false;
    resultStream.on('result', function (path) {
      resultFound = true;
      result.journeyTime = (path[path.length-1].arrivalTime - path[0].departureTime)/60000;
      callback(result);
    });
    connectionsStream.on('data', function (data) {
      result.connectionsProcessed++;
      //No trip in Belgium should last longer than 3 hours: stop condition
      if ((data.departureTime - object.departureTime) > 3*60*60*1000) {
        done();
      }
    });
    resultStream.on('data', function (data) {
      result.connectionsMST++;
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
