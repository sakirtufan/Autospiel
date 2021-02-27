// setup
const c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
const context = c.getContext("2d");

// shuffles a list of unique numbers (no repeats, ever).

for (var randomArray = [], i = 0; i < 254; ++i) randomArray[i] = i;

function shuffle(array) {
  var tmp,
    current,
    top = array.length;
  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  return array;
}

randomArray = shuffle(randomArray);
randomArray.push(randomArray[0]); // Synchronize the first index with the last index to avoid conflict
console.table(randomArray);

// Go from value a to value b in t steps
const lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI))/2;

// draw more lines with fewer numbers
const noise = (x) => {
  x = x * 0.01 % 254;
  return lerp(
    randomArray[Math.floor(x)],
    randomArray[Math.ceil(x)],
    x - Math.floor(x)
  );
};

// init
const bgColor = "#ff4301";
const foregroundColor = "#4a3f35";
const lineColor = "#2f2519";
const lineWidth = 5;
const offset = -10;
let step = 0;
const yRatio = .3;
let speed = 0;

// draw
function draw() {

  speed -= (speed - 1) * 0.01;
  step += 5 * speed;
  
  context.fillStyle = bgColor;
  context.fillRect(0, 0, c.width, c.height);
  context.fillStyle = foregroundColor;
  context.strokeStyle = lineColor;
  context.lineWidth = lineWidth;

  context.beginPath();
  context.moveTo(offset, c.height - offset);  

  for (let i = offset; i < c.width - offset; ++i) {
    context.lineTo(i,(c.height * .9) - noise(i + step) * yRatio);
  }

  context.lineTo(c.width - offset, c.height - offset);
  context.closePath();
  context.fill();
  context.stroke();
  requestAnimationFrame(draw);
}

draw();
