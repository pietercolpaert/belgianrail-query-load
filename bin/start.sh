#!/bin/bash
[[ $1 ]] || { echo "Give the lc server's pid as a first argument"; exit; };
[[ $2 ]] || { echo "Give the queryserver's pid as the second argument"; exit; };
# Script to load the benchmark that will run for 13 hours (18 query mixes, 3 set-ups, 15 minutes each)

lc=config-lc-cache.json
lcnc=config-lc-nocache.json
qs=config-queryserver.json

q1="query-mixes/round1.jsonstream"
q2="$q1 query-mixes/round2.jsonstream"
q3="$q2 query-mixes/round3.jsonstream"
q4="$q3 query-mixes/round4.jsonstream"
q5="$q4 query-mixes/round5.jsonstream"
q6="$q5 query-mixes/round6.jsonstream"
q7="$q6 query-mixes/round7.jsonstream"
q8="$q7 query-mixes/round8.jsonstream"
q9="$q8 query-mixes/round9.jsonstream"
q10="$q9 query-mixes/round10.jsonstream"
q11="$q10 query-mixes/round11.jsonstream"
q12="$q11 query-mixes/round12.jsonstream"
q13="$q12 query-mixes/round13.jsonstream"
q14="$q13 query-mixes/round14.jsonstream"
q15="$q14 query-mixes/round15.jsonstream"
q16="$q15 query-mixes/round16.jsonstream"
q17="$q16 query-mixes/round17.jsonstream"

mkdir results;

## Launch Experiment 0
sort -n -t: -k2 $q1 | ./bin/runner.js -c $lc > results/experiment0-lc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q1 | ./bin/runner.js -c $qs > results/experiment0-queryserver.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q1 | ./bin/runner.js -c $lcnc > results/experiment0-lcnc.csv &
pidstat -p $2 895 1| grep Average >> benchmarkcpu.log;
sleep 10;

## Launch Experiment 1
sort -n -t: -k2 $q2 | ./bin/runner.js -c $lc > results/experiment1-lc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q2 | ./bin/runner.js -c $qs > results/experiment1-queryserver.csv &
pidstat -p $2 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q2 | ./bin/runner.js -c $lcnc > results/experiment1-lcnc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;

## Launch Experiment 2
sort -n -t: -k2 $q3 | ./bin/runner.js -c $lc > results/experiment2-lc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q3 | ./bin/runner.js -c $qs > results/experiment2-queryserver.csv &
pidstat -p $2 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q3 | ./bin/runner.js -c $lcnc > results/experiment2-lcnc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;

## Launch Experiment 3
sort -n -t: -k2 $q4 | ./bin/runner.js -c $lc > results/experiment3-lc.csv&
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q4 | ./bin/runner.js -c $qs > results/experiment3-queryserver.csv &
pidstat -p $2 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q4 | ./bin/runner.js -c $lcnc > results/experiment3-lcnc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;

## Launch Experiment 4
sort -n -t: -k2 $q5 | ./bin/runner.js -c $lc > results/experiment4-lc.csv&
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q5 | ./bin/runner.js -c $qs > results/experiment4-queryserver.csv &
pidstat -p $2 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q5 | ./bin/runner.js -c $lcnc > results/experiment4-lcnc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;

## Launch Experiment 5
sort -n -t: -k2 $q6 | ./bin/runner.js -c $lc > results/experiment5-lc.csv&
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q6 | ./bin/runner.js -c $qs > results/experiment5-queryserver.csv &
pidstat -p $2 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
sort -n -t: -k2 $q6 | ./bin/runner.js -c $lcnc > results/experiment5-lcnc.csv &
pidstat -p $1 895 1| grep Average >> benchmarkcpu.log;
sleep 10;
