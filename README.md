# link-picker

Pickup URL links found on HTML. RSS/RDF/Atom sources are also accepted.

## Usage

This package provides both interfaces of CLI and JavaScript API.

## CLI

```
  $ npm install -g link-picker

  $ link-picker -h

  Usage: link-picker [options] URL

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -v, --verbose        output verbose messages
    -t, --text           output as plain text (default)
    -j, --json           output as JSON
    -m, --match <URL>    match URL (regexp)
    -b, --base <URL>     base URL for local HTML
    -o, --output <file>  save as a file
    --ignore-hash        ignore after # hash in URL

  $ link-picker http://www.google.com/
  http://www.google.com/
  http://www.google.co.jp/webhp?hl=ja&tab=ww
  http://www.google.co.jp/imghp?hl=ja&tab=wi
  http://maps.google.co.jp/maps?hl=ja&tab=wl
  https://play.google.com/?hl=ja&tab=w8
  ...
```

## JavaScript API

### Installation

```sh
    npm install link-picker
```

### Callback Style

This simple example shows all URLs linked from http://www.apple.com/

```javascript
    var LinkPicker = require("link-picker");

    var url  = "http://www.apple.com/";

    LinkPicker().fetch(url, function(err, res) {
        if (err) {
            console.error(err);
        } else {
            res.forEach(function(url) {
                console.log(url);
            });
        }
    });
```

### Event Style

This example shows the latest node.js distribution package URL linked from http://node.js/

```javascript
    var LinkPicker = require("link-picker");

    var url  = "http://nodejs.org/";
    var opts = { match: "http://nodejs.org/dist/" };

    var picker = new LinkPicker(opts)
    .on("complete", function(res) {
        console.log(res);
    })
    .on("error", function(err) {
        console.error(err);
    })
    .on("progress", function(info) {
        console.log(info);
    })
    .fetch(url);
```

## Author

@kawanet

## Licence

Copyright 2013 @kawanet

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
