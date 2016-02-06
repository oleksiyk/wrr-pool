[![Build Status](https://travis-ci.org/oleksiyk/wrr-pool.svg)](https://travis-ci.org/oleksiyk/wrr-pool)
[![Test Coverage](https://codeclimate.com/github/oleksiyk/wrr-pool/badges/coverage.svg)](https://codeclimate.com/github/oleksiyk/wrr-pool/coverage)
[![Dependencies](https://david-dm.org/oleksiyk/wrr-pool.svg)](https://david-dm.org/oleksiyk/wrr-pool)
[![DevDependencies](https://david-dm.org/oleksiyk/wrr-pool/dev-status.svg)](https://david-dm.org/oleksiyk/wrr-pool#info=devDependencies)

# WRRPool

WRRPool is a Weighted Round Robin resource pool

## Using

```
npm install wrr-pool
```

#### Basic usage

```javascript
var WRRPool = require('wrr-pool');

var pool = new WRRPool();

pool.add('A', 4); // pool.add({ host: '10.0.1.10', port: 8087}, 4)
pool.add('B', 3); // pool.add({ host: '10.0.1.11', port: 8087}, 3)
pool.add('C', 2); // pool.add({ host: '10.0.1.12', port: 8087}, 2)

pool.next(); // A
pool.next(); // A
pool.next(); // B
pool.next(); // A
pool.next(); // B
pool.next(); // C
pool.next(); // A
pool.next(); // B
pool.next(); // C
```

#### Get resource and its weight

```javascript
var pool = new WRRPool();

pool.add({ id: 1 }, 4);
pool.add({ id: 2 }, 3);
pool.add({ id: 3 }, 2);

pool.get({ id: 2 }); // => { value: { id: 2 }, weight: 3 }
```

```javascript
var pool = new WRRPool();

pool.add({ id: 1 }, 4);
pool.add({ id: 2 }, 3);
pool.add({ id: 3 }, 2);

pool.get(function (v){ return v.id === 2; }); // => { value: { id: 2 }, weight: 3 }
```

#### Update resource value and/or weight

```javascript
var pool = new WRRPool();

pool.add('A', 4);
pool.add('B', 3);
pool.add('C', 2);

// update value to 'B1' and weight to 4
pool.update(function (v) { return v === 'B';}, 'B1', 4); // => returns index of updated element or undefined if not found
```

#### Remove resource from pool

```javascript
var pool = new WRRPool();

pool.add('A', 4);
pool.add('B', 3);
pool.add('C', 2);

pool.remove(function (v) { return v === 'C';});  // => returns index of removed element or undefined if not found
```

## License
MIT
