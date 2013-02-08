"use strict";

var assert = require('assert'),
    jstype = require('..'),
    type = jstype.type,
    extendType = jstype.extendType;

var t,
    undef,
    samples = {
        base: {
            "undefined": undef,
            "null": null,
            "string": 'a string value',
            "function": function() { },
            "boolean": true,
            "object": {},
            "date": new Date(),
            "regexp": / /,
            "array": [1, 2, 3],
            "number": 1
        },
        extended: {
            "integer": 1,
            "infinity": Infinity,
            "nan": NaN,
            "float": 1.1
        }
    };


// test base types
for (t in samples.base) {
    if (samples.base.hasOwnProperty(t)) {
        assert.equal(type(samples.base[t]), t);
    }
}

// test extended numerics 
for (t in samples.extended) {
    if (samples.extended.hasOwnProperty(t)) {
        assert.equal(type(samples.extended[t], true), t);
    }
}

// test custom defined types
function Custom1() { };
function Custom2() { };
jstype.define(Custom1);
jstype.define('custom2', Custom2);

var instance1 = new Custom1(),
    instance2 = new Custom2();
assert.equal(type(instance1, true), 'Custom1');
assert.equal(type(instance2, true), 'custom2');

// test baseNumeric argument with extended types
assert.equal(type(1, true, true), 'number');
assert.equal(type(instance1, true, true), 'Custom1');
assert.equal(type(instance2, false, true), 'object');
