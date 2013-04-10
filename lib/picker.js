// picker.js

module.exports = LinkPicker;

var fs = require("fs");
var util = require("util");
var events = require("events");
var request = require('request');
var cheerio = require('cheerio');
var feedparser = require("feedparser");

function LinkPicker(opts) {
    if (!(this instanceof LinkPicker)) return new LinkPicker(opts);
    events.EventEmitter.call(this);
    if (!opts) opts = {};
    this.match = opts.match;
    this.base = opts.base;
    this.ignoreHash = opts.ignoreHash;
    this.proxy = opts.proxy;
}

util.inherits(LinkPicker, events.EventEmitter);

LinkPicker.prototype.error = function(err) {
    if ("string" == typeof err) err = new Error(err);
    this.emit("error", err);
};

LinkPicker.fetch = function() {
    var picker = new LinkPicker();
    picker.fetch.apply(picker, arguments);
};

LinkPicker.prototype.fetch = function(source, callback) {
    this.source = source;
    if (callback instanceof Function) {
        this.once("complete", function(res) {
            if (callback) callback(null, res);
            callback = null;
        });
        this.once("error", function(err) {
            if (callback) callback(err);
            callback = null;
        });
    }
    if (!source) return this.error("empty source URL");
    if (source.search(/^https?:\/\//) > -1) {
        this.load_url(source);
    } else if (source == "-") {
        this.load_stdin();
    } else {
        this.load_file(source);
    }
    return this; // chain
};

LinkPicker.prototype.load_stdin = function(source) {
    this.emit("progress", "Loading: stdin");
    process.stdin.setEncoding('utf8');
    var buf = [];
    process.stdin.on('data', function(chunk) {
        buf.push(chunk);
    });
    process.stdin.on('end', function() {
        var content = buf.join("");
        this.emit("progress", "Loaded: " + content.length);
        this.parse(content);
    }.bind(this));
    process.stdin.resume();
};

LinkPicker.prototype.load_file = function(source) {
    this.emit("progress", "Loading: " + source + " (local)");
    var content = fs.readFileSync(source, "utf8");
    this.emit("progress", "Loaded: " + content.length);
    this.parse(content);
};

LinkPicker.prototype.load_url = function(url) {
    var self = this;
    this.emit("progress", "Loading: " + url);
    if (!url) {
        this.error("empty URL");
        return;
    }
    var options = {url: url};
    if (this.proxy) {
        options.proxy = this.proxy;
    }
    request.get(options, function(err, res, body) {
        if (err) {
            self.error(err);
        } else if (res.statusCode != 200) {
            self.error(res.statusCode);
        } else {
            self.emit("progress", "Loaded: " + body.length);
            self.parse(body);
        }
    });
};

LinkPicker.parse = function() {
    var picker = new LinkPicker();
    picker.parse.apply(picker, arguments);
};

LinkPicker.prototype.parse = function(content, callback) {
    if (callback instanceof Function) {
        this.once("complete", function(res) {
            if (callback) callback(null, res);
            callback = null;
        });
        this.once("error", function(err) {
            if (callback) callback(err);
            callback = null;
        });
    }
    if (!content) {
        this.error("no content");
    } else if (content.search(/<(rss|rdf:RDF|atom)\s/) > -1 && content.search(/<html[\s\>]/) < 0) {
        this.parse_rss(content);
    } else {
        this.parse_html(content);
    }
    return this; // chain
};

LinkPicker.prototype.parse_rss = function(xml) {
    var self = this;
    var match = this.match;
    if (match) this.emit("progress", "Match: " + match);
    feedparser.parseString(xml, function(err, meta, articles) {
        if (err) {
            self.error(err);
            return;
        }
        var check = {};
        articles.forEach(function(item) {
            var link = item.link;
            if (!link) return;
            if (link && match && link.search(match) < 0) return;
            if (check[link]) return;
            self.emit("progress", "Found: " + link + " (" + item.title + ")");
            check[link] = true;
        });
        var list = Object.keys(check);
        self.emit("progress", "Total: " + list.length + "/" + articles.length + " URLs found in RSS");

        self.emit("complete", list);
    });
};

LinkPicker.prototype.parse_html = function(html) {
    var self = this;
    var $ = cheerio.load(html);
    var match = this.match;
    if (match) this.emit("progress", "Match: " + match);
    var as = $('a');
    var check = {};
    var url = this.source;
    var current = this.base || url;
    if (url && url.search(/:\/\//) > -1) {
        if (!(match && url.search(match) < 0)) check[url] = true;
    }
    as.each(function(idx, elem) {
        var href = $(elem).attr('href');
        if (self.ignoreHash) {
            href = href.replace(/#.*$/, "");
        }
        if (!href) return;
        var link = follow_link(current, href);
        if (!link) return;
        if (match && link.search(match) < 0) return;
        if (link.search(/^[\?]+\.(png|jpe?g|png|pdf)(\?.*)?$/i) > -1) return;
        if (check[link]) return;
        var slink = link.replace(/\/(index\.(s?html|php)|default\.asp)$/, "/");
        if (check[slink]) return;
        if (link == href) {
            self.emit("progress", "Found: " + link);
        } else {
            self.emit("progress", "Found: " + link + " <= " + href);
        }
        check[link] = true;
    });
    var list = Object.keys(check);
    self.emit("progress", "Total: " + list.length + "/" + as.length + " URLs found in HTML");

    self.emit("complete", list);
};

function follow_link(base, href) {
    if (!href) {
        return null;
    }
    if (href.search(/^#/) == 0) {
        return base;
    }
    if (href.search(/^\w+:\/\//) == 0) {
        return href;
    }
    if (!base) return href;
    var a1 = base.split("://", 2);
    if (a1.length < 2) return href;
    var scheme = a1[0];
    var a2 = a1[1].split("/");
    var host = a2.shift();
    var file = a2.pop();
    if (href.search(/^\/\//) == 0) {
        return scheme + ":" + href;
    }
    if (href.search(/^\//) == 0) {
        return scheme + "://" + host + href;
    }
    var parent = a2.join("/") || ".";
    href = "/" + parent + "/" + href;
    while (1) {
        var prev = href;
        href = href.replace(/\/\.\//g, "/");
        href = href.replace(/\/([^\/]+)\/\.\.\//g, "/");
        if (prev === href) break;
    }
    return scheme + "://" + host + href;
}
