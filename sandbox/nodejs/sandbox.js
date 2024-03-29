const TimedMap = require('es6-timed-map');

console.log('test ', {
  TimedMap,
  type: typeof TimedMap
});
const timedMap = new TimedMap();

timedMap.set('firstKey', 'first-value', 100);
timedMap.set('secondKey', 'second-value', 300);

// wait for 100ms
console.log(timedMap.get('firstKey'));
console.log(timedMap.get('secondKey'));
