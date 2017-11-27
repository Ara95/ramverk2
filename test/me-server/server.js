var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var request = require('supertest');
var app = require('../../index.js');



describe('Check routes', function() {
    it("404", function (done) {
        request(app())
            .get("/404")
            .expect(404, done);
    });
});
