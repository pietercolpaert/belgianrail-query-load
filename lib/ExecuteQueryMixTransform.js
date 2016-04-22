var Transform = require('stream').Transform,
    LCClient = require('lc-client'),
    lcExecute = require('./LCClientExecutor'),
    queryServerExecute = require('./QueryServerExecutor'),
    util = require('util');

util.inherits(ExecuteQueryMixTransform, Transform);

function ExecuteQueryMixTransform (options) {
  Transform.call(this, {objectMode : true});
  this.T0 = new Date();
  this.options = {
    client : new LCClient({entrypoints:[options.url || 'http://localhost:8081/']}),
    url: options.url || 'http://localhost:8082/'
  };
  if (options.type === "query-server") {
    this.executeQuery = queryServerExecute;
  } else {
    this.executeQuery = lcExecute;
  }
  //output CSV header
  console.log("T,http_requests,connections_scanned,journey_time");
}

ExecuteQueryMixTransform.prototype._transform = function (object, encoding, done) {
  if (typeof object.T === "undefined") {
    done();
  } else {
    object.departureStop = object.departureStop.replace('http://irail.be/stations/NMBS/00','');
    object.arrivalStop = object.arrivalStop.replace('http://irail.be/stations/NMBS/00','');
    var dTms = new Date() - this.T0;
    var waitingTime = (object.T * 1000 - dTms);
    var self = this;
    
    var printResult = function (result) {
      console.log(result);
    };

    var execute = function () {
      //console.error("T" + object.T);
      var time0 = new Date();
      self.executeQuery(object, self.options, function (result) {
        result.queryDuration = new Date() - time0;
        printResult(result);
      });
      done();
    };
    if (waitingTime > 0) {
      setTimeout(execute, waitingTime);
    } else {
      execute();
    }
  }
}

module.exports = ExecuteQueryMixTransform;
