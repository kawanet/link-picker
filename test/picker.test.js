var expect = require('chai').expect,
LinkPicker = require("../");

describe('LinkPicker', function() {

    describe('#fetch', function() {
        var source = 'http://www.google.co.jp/',
        source_notfound = 'http://www.google.co.jp/notfound';

        var picker;

        beforeEach(function() {
            picker = new LinkPicker({
                base: null,
                match: 'http://play.google.co.jp/'
            });
        });

        it('emit "complete" with links on success', function(done) {
            picker.on("complete", function(links) {
                //console.log(links);
                expect(links).to.not.be.empty;
                expect(links[0]).to.equal(source);
                links.slice(1).forEach(function(link) {
                    expect(link).to.satisfy(function(link) {
                        return link.search(picker.match) >= 0;
                    });
                });
                done();
            });
            picker.fetch(source);
        });

        it('emit "error" on error', function(done) {
            picker.on("error", function() {
                done();
            });
            picker.fetch(source_notfound);
        });

        it('emit "progress" on progress', function(done) {
            var info_list = [];
            picker.on("progress", function(info) {
                info_list.push(info);
            });
            picker.on("complete", function() {
                //console.log(info_list);
                expect(info_list).to.not.be.empty;
                done();
            });
            picker.fetch(source);
        });

    });

});
