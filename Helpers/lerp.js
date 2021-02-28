// Go from value a to value b in t steps
const lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;

export default lerp;