[![npm version](https://badge.fury.io/js/es6-timed-map.svg)](https://badge.fury.io/js/es6-timed-map)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

# es6-timed-map

An es6-map-like utility class with time based functions and support

<!-- TODO: add TOC -->

## Summary

This class provides a similar interface as the [es6 Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), however
this also provides "timed" based functionality to automatically remove older entries.

## Installation

This library is available on npm:

```
npm install es6-timed-map
```

## Usage

Here is a basic example of using this library (more examples will be on the way)

```js
const TimedMap = require('es6-timed-map');

const timedMap = new TimedMap();

timedMap.set('firstKey', 'first-value', 100); // save for 100ms
timedMap.set('secondKey', 'second-value', 300); // save for 300ms

// wait for 100ms
console.log(timedMap.get('firstKey')); // undefined
console.log(timedMap.get('secondKey')); // 'second-value'
```

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) and review the [CODE_OF_CONDUCT](./CODE_OF_CONDUCT).

## Reference

TBD....

<!-- TODO: add github action to automate this? -->

## Security

See [SECURITY](./SECURITY.md)

## Hacktoberfest 2020 :jack_o_lantern:

This repo participated in [hacktoberfest 2020](https://hacktoberfest.digitalocean.com/), so thank you for all of those that participated, keep learning, keep building and happy hacktoberfest! :+1:

## License

[MIT](./LICENSE)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
