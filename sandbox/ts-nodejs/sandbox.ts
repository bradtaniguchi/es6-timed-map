import TimedMap from 'es6-timed-map';

const timedMap = new TimedMap();

timedMap.set('firstKey', 'first-value', 100);
timedMap.set('secondKey', 'second-value', 300);

// wait for 100ms
console.log(timedMap.get('firstKey'));
console.log(timedMap.get('secondKey'));
