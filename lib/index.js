'use strict';

var gcd = require('./gcd');
var _   = require('lodash');

/*
http://kb.linuxvirtualserver.org/wiki/Weighted_Round-Robin_Scheduling

Supposing that there is a server set S = {S0, S1, …, Sn-1};

W(Si) indicates the weight of Si;

i indicates the server selected last time, and i is initialized with -1;

cw is the current weight in scheduling, and cw is initialized with zero;

max(S) is the maximum weight of all the servers in S;

gcd(S) is the greatest common divisor of all server weights in S;

while (true) {
    i = (i + 1) mod n;
    if (i == 0) {
        cw = cw - gcd(S);
        if (cw <= 0) {
            cw = max(S);
            if (cw == 0)
            return NULL;
        }
    }
    if (W(Si) >= cw)
        return Si;
}
*/


function Pool() {
    this.peers = [];
}

module.exports = Pool;

Pool.prototype._reset = function () {
    this.i = -1;
    this.cw = 0;
    this.maxS = 0;
    this.gcdS = 0;

    this.maxS = _.maxBy(this.peers, 'weight').weight;

    this.gcdS = _.map(this.peers, 'weight').reduce(function (prev, cur) {
        return gcd(prev, cur);
    }, 0);
};

Pool.prototype.add = function (value, weight) {
    this.peers.push({
        value: value,
        weight: weight
    });

    this._reset();
};

Pool.prototype.next = function () {
    if (this.peers.length === 0) {
        return null;
    }
    while (true) { // eslint-disable-line
        this.i = (this.i + 1) % this.peers.length;
        if (this.i === 0) {
            this.cw = this.cw - this.gcdS;
            if (this.cw <= 0) {
                this.cw = this.maxS;
                if (this.cw === 0) {
                    return null;
                }
            }
        }
        if (this.peers[this.i].weight >= this.cw) {
            return this.peers[this.i].value;
        }
    }
};
