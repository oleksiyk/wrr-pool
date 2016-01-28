'use strict';

function gcd(a, b) {
    var max = Math.max(a, b);
    var min = Math.min(a, b);
    var mod = 0;

    while (min !== 0) {
        mod = max % min;
        max = min;
        min = mod;
    }

    return max;
}

module.exports = gcd;

/*
module.exports = function() {
    var args = Array.prototype.slice.apply(arguments);

    if (args.length > 3) {
        args.sort(function(a, b) {
            return a - b;
        });
    }

    return args.reduce(function(acc, cur) {
        return gcd(acc, cur);
    });
};
*/
