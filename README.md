# Benchmark your Belgianrail route planner with this query load

In order to fire a query load, execute this:

```bash
sort -n -t: -k2 query-mixes/3.jsonstream | ./bin/runner.js -c config.json
```

First, copy `config-example.json` to your own configuration on how you want to launch the queries.

## Transit schedules

You can find a dump of the transit schedules here:

It's a newline delimited json objects file, with each object a connection. A connection looks something like this:

```javascript
{
    departureTime: '2015-10-02T06:11:00.000Z',
    arrivalTime: '2015-10-02T06:12:00.000Z',
    arrivalStop: '8811536',
    departureStop: '8811528',
    trip: '15637'
}
```

## query-mixes

This folder contains query mixes for 15 minutes, all at 4pm on the first of October 2015.

A query looks something like this:
```javascript
{
    T : 7, //seconds after the start it should be executed
    departureTime : '2015-10-02T06:11:00.000Z',
    departureStop: '8811528',
    arrivalStop: '8811536'
}
```

Each file contains a query mix. This was the real query mix that happened on the iRail API at that time.

In order to benchmark the scalability, we execute different query loads and measure the uptime each time after 15 minutes.
