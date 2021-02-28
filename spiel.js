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
const yRatio = .2;
let speed = 0;
let playing = true;

const player = new function() {
  this.x = c.width / 2;
  this.y = 50;
  this.truck = new Image();
  this.truck.src = "truck.png";
  this.rotation = 0;
  this.gravity = 0;
  this.rotationSpeed = 0;

  this.draw = function () {

    let point1 = (c.height * .9) - noise(this.x + step) * yRatio;
    let point2 = (c.height * .9) - noise(this.x + step + 5) * yRatio;

    let offset = 28;

    // truck is on the ground or in the air
    let ground = 0;
    if (point1 - offset > this.y) {
      this.gravity += 0.1;
    } else {
      this.gravity -= this.y - (point1 - offset);
      this.y = point1 - offset;
      ground = 1;
    }

    // Is the truck overturned?
    if (!playing || ground && Math.abs(this.rotation) > Math.PI * .5) {
      playing = false;
      this.rotationSpeed = 5;
      this.x -= speed * 5;

      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = "32px Impact";
      context.fillStyle = "white"
      context.fillText("Game Over !", c.width / 2, c.height / 3)
    }
    

    let angle = Math.atan2((point2 - offset) - this.y, (this.x + 5) - this.x);
    if (ground && playing) {
      this.rotation -= (this.rotation - angle) * 0.5;
      this.rotationSpeed = this.rotationSpeed - (angle - this.rotation)
    }

    this.rotation -= (this.rotationSpeed * 0.1)    

    // fix the rotation problem
    if (this.rotation > Math.PI) this.rotation = -Math.PI;
    if (this.rotation < -Math.PI) this.rotation = Math.PI;

    this.y += this.gravity;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.drawImage(this.truck, -40, -40, 80, 80);
    context.restore();
  }
}

// draw
function draw() {

  speed -= (speed - 1) * 0.01;
  step += 5 * speed;
  
  // background
  context.fillStyle = bgColor;
  context.fillRect(0, 0, c.width, c.height);

  // player
  player.draw()

  // ground
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

  // animation
  requestAnimationFrame(draw);
}

draw();
