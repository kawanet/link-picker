# link-picker

Pickup link URLs found on HTML/RSS/RDF/Atom

## Installation

```sh
    npm install link-picker
```

## Usage

CLI:

```
  $ link-picker -m http://www.google.com/ http://www.google.com/
  http://www.google.com/
  http://www.google.com/preferences?hl=ja
  http://www.google.com/advanced_search?hl=ja&authuser=0
  http://www.google.com/language_tools?hl=ja&authuser=0
  http://www.google.com/intl/ja/about.html

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
```

JavaScript API:

```javascript
    var LinkPicker = require("link-picker");

    var picker = new LinkPicker(program);

    picker.on("complete", function(res) {
        res.forEach(function(url) {
            console.log(url);
        });
    });

    picker.on("error", function(err) {
        console.error(err);
    });

    picker.on("progress", function(info) {
        console.log(info);
    });

    picker.fetch(input, function(err, res) {
        if (err) {
            console.error(err);
        } else {
            console.log(res);
        }
    });
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
