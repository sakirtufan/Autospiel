import shuffle from "./Helpers/shuffle.js";
import lerp from "./Helpers/lerp.js";
import isMobile from "./Helpers/mobileCheck.js";
import { checkButtonPress, checkButtonRelase } from "./Helpers/checkButton.js";

// setup
const c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
const context = c.getContext("2d");

// shuffles a list of unique numbers (no repeats, ever).
for (var randomArray = [], i = 0; i < 254; ++i) randomArray[i] = i;
randomArray = shuffle(randomArray);
randomArray.push(randomArray[0]); // Synchronize the first index with the last index to avoid conflict



// draw more lines with fewer numbers
const noise = (x) => {
  x = (x * 0.01) % 254;
  return lerp(
    randomArray[Math.floor(x)],
    randomArray[Math.ceil(x)],
    x - Math.floor(x)
  );
};

// init
const bgColor = "#505A27";
const foregroundColor = "#6A6E73";
const lineColor = "#2f2519";
const lineWidth = 5;
const offset = -10;
let step = 0;
const yRatio = 0.2;
let speed = 0;
let playing = true;
let controls = { ArrowUp: 0, ArrowLeft: 0, ArrowRight: 0 };

const player = new (function () {
  this.x = c.width / 2;
  this.y = 50;
  this.truck = new Image();
  this.truck.src = "./UI/truck.png";
  this.rotation = 0;
  this.ySpeed = 0;
  this.rotationSpeed = 0;

  // interface
  this.startButton = new Image();
  this.startButton.src = "./UI/start.png";
  this.leftButton = new Image();
  this.leftButton.src = "./UI/left.png";
  this.rightButton = new Image();
  this.rightButton.src = "./UI/right.png";
  this.fireButton = new Image();
  this.fireButton.src = "./UI/fire.png";

  this.drawInterface = function () {
    if (playing) {
      // interface drawing
      if (isMobile) {
        context.drawImage(this.leftButton, 20, c.height - 90, 70, 70);
        context.drawImage(this.rightButton, 110, c.height - 90, 70, 70);
        context.drawImage(this.fireButton, c.width - 90, c.height - 90, 70, 70);
      }
    } else {
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "32px Impact";
      context.fillStyle = "white";
      context.fillText("Game Over !", c.width / 2, c.height / 3);
      context.drawImage(
        this.startButton,
        c.width / 2 - 54,
        c.height / 3 + 50,
        108,
        48
      );
    }
  };

  this.draw = function () {
    let point1 = (c.height * .9) - noise(this.x + step) * yRatio;
    let point2 = (c.height * .9) - noise(this.x + step + 5) * yRatio;

    let offset = 28;

    // truck is on the ground or in the air
    let ground = 0;
    if (point1 - offset > this.y) {
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (point1 - offset);
      this.y = point1 - offset;
      ground = 1;
    }

    // fall check
    if (!playing || (ground && Math.abs(this.rotation) > Math.PI * 0.5)) {
      playing = false;
      this.rotationSpeed = 5;
      controls.ArrowUp = 1;
      this.x -= speed * 5;
    }

    // rotation calculator
    let angle = Math.atan2(point2 - offset - this.y, (this.x + 5) - this.x);
    if (ground && playing) {
      this.rotation -= (this.rotation - angle) * 0.5;
      this.rotationSpeed = this.rotationSpeed - (angle - this.rotation);
    }

    this.rotationSpeed += (controls.ArrowLeft - controls.ArrowRight) * 0.05;
    this.rotation -= this.rotationSpeed * 0.05;

    this.rotation -= this.rotationSpeed * 0.1;

    // fix the rotation problem
    if (this.rotation > Math.PI) this.rotation = -Math.PI;
    if (this.rotation < -Math.PI) this.rotation = Math.PI;

    this.y += this.ySpeed;

    // drawing

    // truck drawing
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.drawImage(this.truck, -40, -40, 80, 80);
    context.restore();
  };
})();

// draw
function draw() {
  speed -= (speed - (controls.ArrowUp)) * 0.01;
  step += 10 * speed;

  // background
  context.fillStyle = bgColor;
  context.fillRect(0, 0, c.width, c.height);

  // player
  player.draw();

  // ground
  context.fillStyle = foregroundColor;
  context.strokeStyle = lineColor;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.moveTo(offset, c.height - offset);

  for (let i = offset; i < c.width - offset; ++i) {
    context.lineTo(i, (c.height * .9) - noise(i + step) * yRatio);
  }

  context.lineTo(c.width - offset, c.height - offset);
  context.closePath();
  context.fill();
  context.stroke();

  player.drawInterface();

  

  // animation
  requestAnimationFrame(draw);
}

draw();

// mobile controls
if (isMobile) {
  c.addEventListener("touchstart", handleStart, false);
  c.addEventListener("touchend", handleEnd, false);

  function handleStart(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      checkButtonPress(playing,touch.pageX, touch.pageY,c.width,c.height,controls);
    }
  }

  function handleEnd(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      checkButtonRelase(playing,touch.pageX, touch.pageY,c.width,c.height,controls);
    }
  }
} else {  
  // desktop controls
  onkeydown = d => controls[d.key] = 1;
  onkeyup = d => controls[d.key] = 0;

  c.addEventListener("click", handleClick, false);
  function handleClick(e) {
    checkButtonPress(playing,e.clientX, e.clientY,c.width,c.height,controls);
  }
}

window.onresize = function () {
  window.location.reload();
}







