'use strict';

/* global describe, it, before, after, expect  */

var WRRPool = require('../lib/index');
var _       = require('lodash');

it('should return proper sequence', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    pool.size().should.be.eql(3);

    _().range(18).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 8,
        B: 6,
        C: 4
    });
});

it('next() should return null when no peers added', function () {
    var pool = new WRRPool();

    expect(pool.next()).to.eql(null);
    expect(pool.next()).to.eql(null);
    expect(pool.next()).to.eql(null);
    expect(pool.next()).to.eql(null);
});

it('should work with single peer', function () {
    var pool = new WRRPool();

    pool.add('A', 4);

    _().range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 12
    });
});

it('should work when peers have same weight', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 4);
    pool.add('C', 4);

    _().range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 4,
        C: 4
    });
});

it('should exclude peer with weight = 0', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 0);

    _().range(14).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 8,
        B: 6
    });
});

it('weight < 0 effectively means weight=0', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', -2);

    _().range(14).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 8,
        B: 6
    });
});

it('should return null when all peers have weight = 0', function () {
    var pool = new WRRPool();

    pool.add('A', 0);
    pool.add('B', 0);
    pool.add('C', 0);

    expect(pool.next()).to.eql(null);
    expect(pool.next()).to.eql(null);
    expect(pool.next()).to.eql(null);
    expect(pool.next()).to.eql(null);
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

it('default weight is 10', function () {
    var pool = new WRRPool();

    pool.add({ id: 1 });
    pool.add({ id: 2 }, 'x');
    pool.add({ id: 3 }, {});

    pool.get({ id: 1 }).should.have.property('weight', 10);
    pool.get({ id: 2 }).should.have.property('weight', 10);
    pool.get({ id: 3 }).should.have.property('weight', 10);
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

    _().range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });

    pool.update(function (v) { return v === 'B';}, 'B1', 4).should.be.eql(1);
    pool.update(function (v) { return v === 'C';}, 'C1', 4).should.be.eql(2);

    _().range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B1: 4,
        C1: 4
    });
});

it('update() should not reset internal state if weight hasnt changed', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    // this is not a very good test, as the order of peers may change (if we sort it for example)
    _().range(8).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 1
    });

    pool.update(function (v) { return v === 'C';}, 'C1', 2).should.be.eql(2);

    pool.next().should.be.eql('C1');
});

it('update() failed predicate returns undefined', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    expect(pool.update(function (v) { return v === 'D';}, 'B1', 100)).to.eql(undefined);

    _().range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
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

    pool.size().should.be.eql(2);

    _().range(7).map(pool.next.bind(pool)).countBy().value().should.be.eql({
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

    pool.size().should.be.eql(3);

    _().range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });
});

it('updateWeight()', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    _().range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });

    pool.updateWeight(function (v) { return v === 'B';}, 4).should.be.eql(1);
    pool.updateWeight(function (v) { return v === 'C';}, 4).should.be.eql(2);

    _().range(12).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 4,
        C: 4
    });
});

it('updateWeight() failed predicate returns undefined', function () {
    var pool = new WRRPool();

    pool.add('A', 4);
    pool.add('B', 3);
    pool.add('C', 2);

    expect(pool.updateWeight(function (v) { return v === 'D';}, 100)).to.eql(undefined);

    _().range(9).map(pool.next.bind(pool)).countBy().value().should.be.eql({
        A: 4,
        B: 3,
        C: 2
    });
});
