﻿"use strict";

var path = require('path'),
    test = require('tap').test,
    jsType = require('..');

test("jsType module", function(test) {

    test.test("type", function(test) {
        var type = jsType.type;
        test.ok(type);
        test.test("base types", function(test) {
            test.equal(type(undefined), 'undefined');
            test.equal(type(null), 'null');
            test.equal(type(NaN), 'number');
            test.equal(type('test string'), 'string');
            test.equal(type(new Date('1-1-2011')), 'date');
            test.equal(type(function test() {}), 'function');
            test.equal(type(true), 'boolean');
            test.equal(type(false), 'boolean');
            test.equal(type(-1), 'number');
            test.equal(type(0), 'number');
            test.equal(type(1), 'number');
            test.equal(type(9999), 'number');
            test.equal(type([1, 2, 3]), 'array');
            test.equal(type(['a', 'b', 'c']), 'array');
            test.equal(type(/[a-z]/), 'regexp');
            test.equal(type({}), 'object');
            test.equal(type({
                foo: 'bar'
            }), 'object');
            test.end();
        });

        test.test("extended numeric types", function(test) {
            test.equal(type(1, true), 'integer');
            test.equal(type(1.1, true), 'float');
            test.equal(type(1 / 0, true), 'infinity');
            test.equal(type(Infinity, true), 'infinity');
            test.equal(type(NaN, true), 'nan');
            test.end();
        });

        test.test("custom defined types", function(test) {
            test.ok(jsType.define);
            // test custom defined types

            function Custom1() {}

            function Custom2() {}
            jsType.define(Custom1);
            jsType.define('custom2', Custom2);

            var instance1 = new Custom1(),
                instance2 = new Custom2();
            test.equal(type(instance1, true), 'Custom1');
            test.equal(type(instance2, true), 'custom2');

            test.test("baseNumeric argument with extended types", function(test) {
                test.equal(type(1, true, true), 'number');
                test.equal(type(instance1, true, true), 'Custom1');
                test.equal(type(instance2, false, true), 'object');
                test.end();
            });

            test.end();

        });

        test.test("built-in isType methods", function(test) {
            test.ok(jsType.isNumber(1));
            test.ok(jsType.isString('foo'));
            test.ok(jsType.isObject({
                foo: 'bar'
            }));
            test.ok(jsType.isArray([1, 2]));
            test.ok(jsType.isDate(new Date()));
            test.ok(jsType.isRegexp(/./g));
            test.ok(jsType.isFunction(function () {}));
            test.end();
        });

        test.end();

    });

    test.end();

});