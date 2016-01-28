[![Build Status](https://travis-ci.org/oleksiyk/wrr-pool.png)](https://travis-ci.org/oleksiyk/wrr-pool)

# WRRPool

WRRPool is a Weighted Round Robin resource pool

## Using

```
npm install wrr-pool
```

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

## License
MIT
