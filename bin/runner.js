#!/usr/bin/node

var ExecuteQueryMixTransform = require('../lib/ExecuteQueryMixTransform'),
    JSONStream = require('jsonstream'),
    path = require('path'),
    fs = require('fs'),
    program = require('commander');
console.error("Execute query mixes use --help to discover more functions");

var q;

program
  .version('0.1.0')
  .option('-c --config [file]', 'specify config file')
  .parse(process.argv);

if (!program.config) {
  console.error('Please set a config file with the -c flag');
  process.exit();
}

var configFile = program.config,
    config = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }))

process.stdin.pipe(JSONStream.parse()).pipe(new ExecuteQueryMixTransform(config));
