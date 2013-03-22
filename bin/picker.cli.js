#!/usr/bin/env node

var LinkPicker = require("../lib/picker");
var program = require('commander');
var pkg = require(__dirname + "/../package.json");
var util = require("util");

program.version(pkg.version);
program.usage('[options] URL');
program.option('-b, --base <URL>', 'base URL');
program.option('-m, --match <URL>', 'match URL (regexp)');
program.option('-q, --quiet', 'suppress verbose messages');
program.option('-t, --text', 'plain text output (default)');
program.option('-j, --json', 'JSON output');
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
picker.on("info", info);
picker.fetch(url, callback);

// callback function
function callback(err, res) {
    if (err) {
        // console.log("failure");
    } else {
        // console.log("success", res.length);
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
    console.error("error:", err);
    process.exit(1);
}

// progress handler
function info(str) {
    if (program.quiet) return;
    console.info("info:", str);
}
