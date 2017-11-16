/**
 * Test the test-environment
 */
"use strict";

/* global describe it */

var assert = require("assert");


describe("Testing", function() {
    it("Testing true", function() {
        let one = 1;
        let five = 1;

        assert.equal(one, five);
    });

    it("Testing false", function() {
        let one = 1;
        let two = 2;

        assert.notEqual(one, two);
    });
});
