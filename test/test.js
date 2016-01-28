'use strict';

/* global describe, it, before, after, expect  */

var WRRPool = require('../lib/index');
var _       = require('lodash');

it('should return proper sequence', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    _(0).range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });
});

it('next() should return null when no peers added', function () {
    var pool = new WRRPool();

    expect(pool.next()).to.eql(null);
});

it('should work with single peer', function () {
    var pool = new WRRPool();

    pool.add('A', 4);

    _(0).range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 12
    });
});

it('should work when peers have same weight', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 4);
    pool.add('C', 4);

    _(0).range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 4,
        C: 4
    });
});

it('get()', function () {
    var pool = new WRRPool();

    pool.add({ id: 1 }, 4);
    pool.add({ id: 2 }, 3);
    pool.add({ id: 3 }, 2);

    pool.get({ id: 2 }).should.be.eql({
        value: { id: 2 },
        weight: 3
    });
});

it('get() failed predicate returns undefined', function () {
    var pool = new WRRPool();

    pool.add({ id: 1 }, 4);
    pool.add({ id: 2 }, 3);
    pool.add({ id: 3 }, 2);

    expect(pool.get({ id: 20 })).to.eql(undefined);
});

it('update()', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    _(0).range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });

    pool.update(function (v) { return v === 'B';}, 'B1', 4).should.be.eql(1);
    pool.update(function (v) { return v === 'C';}, 'C1', 4).should.be.eql(2);

    _(0).range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B1: 4,
        C1: 4
    });
});

it('update() failed predicate returns undefined', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    expect(pool.update(function (v) { return v === 'D';}, 'B1', 100)).to.eql(undefined);

    _(0).range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });
});

it('remove()', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    pool.remove(function (v) { return v === 'C';}).should.be.eql(2);

    _(0).range(7).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3
    });
});

it('remove() failed predicate returns undefined', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    expect(pool.remove(function (v) { return v === 'D';})).to.eql(undefined);

    _(0).range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });
});
