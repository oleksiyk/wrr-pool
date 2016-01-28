'use strict';

/* global describe, it, before, after, expect  */

var WRRPool = require('../lib/index');
var _       = require('lodash');

it('should return proper sequence', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    _.range(0, 9).map(function () {
        return pool.next();
    }).join('').should.be.eql('AABABCABC');
});

it('next() should return null when no peers added', function () {
    var pool = new WRRPool();

    expect(pool.next()).to.eql(null);
});

it('should work with single peer', function () {
    var pool = new WRRPool();

    pool.add('A', 4);

    _.range(0, 9).forEach(function () {
        pool.next().should.be.eql('A');
    });
});

it('should work when peers have same weight', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 4);
    pool.add('C', 4);

    _.range(0, 9).map(function () {
        return pool.next();
    }).join('').should.be.eql('ABCABCABC');
});
