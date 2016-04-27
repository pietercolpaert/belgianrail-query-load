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
    client : new LCClient({enableCache: options.enableCache || true, entrypoints:[options.url]}),
    url: options.url
  };
  if (options.type === "query-server") {
    this.executeQuery = queryServerExecute;
  } else {
    this.executeQuery = lcExecute;
  }
  //output CSV header
  console.log('"T","connections scanned","connections MST","journey time","query execution time"');
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
      console.log(result.T + ',' + result.connectionsProcessed + ',' + result.connectionsMST + ',' + result.journeyTime + ',' + result.queryDuration);
    };

    var execute = function () {
      //console.error("T" + object.T);
      var time0 = new Date();
      self.executeQuery(object, self.options, function (result, error) {
        result.queryDuration = new Date() - time0;
        result.durationPer100Connections = result.queryDuration/result.connectionsProcessed*100;
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
