#!/usr/bin/env node

var LinkPicker = require("../lib/picker");
var program = require('commander');
var pkg = require(__dirname + "/../package.json");
var util = require("util");
var colors = require("colors");

program.version(pkg.version);
program.usage('[options] URL');
program.option('-v, --verbose', 'output verbose messages');
program.option('-t, --text', 'output as plain text (default)');
program.option('-j, --json', 'output as JSON');
program.option('-m, --match <URL>', 'match URL (regexp)');
program.option('-b, --base <URL>', 'base URL for local HTML');
program.option('-o, --output <file>', 'save as a file');
program.option('-p, --proxy <URL>', 'HTTP proxy server');
program.option('--ignore-hash', 'ignore after # hash in URL');
program.parse(process.argv);

// die when called without arguments
if (!program.args.length) {
    program.outputHelp();
    process.exit(1);
}

// fetch first argument
var url = program.args.shift();
if (program.args.length) {
    error("Too many arguments.");
}

// call JavaScript API
var picker = new LinkPicker(program);
picker.on("complete", complete);
picker.on("error", error);
picker.on("progress", progress);
picker.fetch(url, callback);

// callback function
function callback(err, res) {
    if (err) {
        // console.log("failure", err);
    } else {
        // console.log("success", res);
    }
}

// success handler
function complete(res) {
    if (program.json) {
        var json = JSON.stringify(res);
        util.print(json);
    }
    if (program.text || !program.json) {
        res.forEach(function(url) {
            util.print(url + "\n");
        });
    }
}

// failure handler
function error(err) {
    console.error(err.toString().inverse.red);
    process.exit(1);
}

// progress handler
function progress(str) {
    if (!program.verbose) return;
    console.log(str.toString().cyan);
}

// output for a file or stdout
function output(str) {
    if (program.output && program.output != '-') {
        progress("output: " + program.output);
        fs.writeFile(program.output, str, function(err) {
            if (err) error(err);
        });
    } else {
        util.print(str);
    }
}
