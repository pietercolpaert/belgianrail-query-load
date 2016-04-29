var Transform = require('stream').Transform,
    LCClient = require('lc-client'),
    lcExecute = require('./LCClientExecutor'),
    queryServerExecute = require('./QueryServerExecutor'),
    util = require('util'),
    fs = require('fs'),
    Monitor = require('./Monitor');

util.inherits(ExecuteQueryMixTransform, Transform);

function ExecuteQueryMixTransform (options) {
  Transform.call(this, {objectMode : true});
  this.T0 = new Date();
  this.options = {
    client : new LCClient({enableCache: options.enableCache, entrypoints:[options.url]}),
    url: options.url
  };
  if (options.type === "query-server") {
    this.executeQuery = queryServerExecute;
  } else {
    this.executeQuery = lcExecute;
  }
  this.summary = {
    config : options.name,
    startedAt: new Date(),
    totalNumberOfQueriesExecuted: 0,
  };
  //output CSV header
  console.log('"T","connections scanned","connections MST","journey time","query execution time","Bytes transferred","number of requests","bytes per connection","ms per connection"');
}

/** 
 * When this stream closes, output a summary of the statistics we were able to gather to a logfile
 */
ExecuteQueryMixTransform.prototype._flush = function (done) {
  var self = this;
  fs.appendFile("benchmark.log", JSON.stringify(self.summary) + '\n', function(err) {
    done(err);
  });
};

ExecuteQueryMixTransform.prototype._transform = function (object, encoding, done) {
  //skip invalid entries
  if (typeof object.T === "undefined" || !object.departureTime || object.departureTime == 'null') {
    done();
  } else {
    this.summary.totalNumberOfQueriesExecuted++;
    //Currently a hack to make sure the identifiers correspond
    object.departureStop = object.departureStop.replace('http://irail.be/stations/NMBS/00','');
    object.arrivalStop = object.arrivalStop.replace('http://irail.be/stations/NMBS/00','');
    var dTms = new Date() - this.T0;
    var waitingTime = (object.T * 1000 - dTms);
    var self = this;
    
    var printResult = function (result) {
      console.log(result.T + ',' + result.connectionsProcessed + ',' + result.connectionsMST + ',' + result.journeyTime + ',' + result.queryDuration + ',' + result.httpTotalBytes + ',' + result.httpRequests + ',' +result.httpTotalBytes/result.connectionsProcessed + ',' + result.queryDuration/result.connectionsProcessed);
    };

    var execute = function () {
      var time0 = new Date();
      self.executeQuery(object, self.options, function (result, error) {
        if (result && result.journeyTime) {
          result.queryDuration = new Date() - time0;
          printResult(result);
        }
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
