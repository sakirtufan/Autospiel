// mobile check
let isMobile = false;
(function (a) {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    )
  )
    isMobile = true;
})(navigator.userAgent || navigator.vendor || window.opera);

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
const lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;

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
const bgColor = "#ff4301";
const foregroundColor = "#4a3f35";
const lineColor = "#2f2519";
const lineWidth = 5;
const offset = -10;
let step = 0;
const yRatio = 0.3;
let speed = 0;
let playing = true;
let desktopControls = { ArrowUp: 0, ArrowLeft: 0, ArrowRight: 0 };

const player = new (function () {
  this.x = c.width / 2;
  this.y = 50;
  this.truck = new Image();
  this.truck.src = "./UI/truck.png";
  this.rotation = 0;
  this.gravity = 0;
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
    let point1 = c.height * 0.9 - noise(this.x + step) * yRatio;
    let point2 = c.height * 0.9 - noise(this.x + step + 5) * yRatio;

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

    // fall check
    if (!playing || (ground && Math.abs(this.rotation) > Math.PI * 0.5)) {
      playing = false;
      this.rotationSpeed = 5;
      desktopControls.ArrowUp = 1;
      this.x -= speed * 5;
    }

    // rotation calculator
    let angle = Math.atan2(point2 - offset - this.y, this.x + 5 - this.x);
    if (ground && playing) {
      this.rotation -= (this.rotation - angle) * 0.5;
      this.rotationSpeed = this.rotationSpeed - (angle - this.rotation);
    }

    this.rotationSpeed += (desktopControls.ArrowLeft - desktopControls.ArrowRight) * 0.05;
    this.rotation -= this.rotationSpeed * 0.05;

    this.rotation -= this.rotationSpeed * 0.1;

    // fix the rotation problem
    if (this.rotation > Math.PI) this.rotation = -Math.PI;
    if (this.rotation < -Math.PI) this.rotation = Math.PI;

    this.y += this.gravity;

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
  speed -= (speed - (desktopControls.ArrowUp)) * 0.01;
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
    context.lineTo(i, c.height * 0.9 - noise(i + step) * yRatio);
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
      const touch = touches[i];
      checkButtonPress(touch.pageX, touch.pageY);
    }
  }

  function handleEnd(e) {
    e.preventDefault();
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
    }
  }
} else {
  // desktop controls

  onkeydown = d => desktopControls[d.key] = 1;
  onkeyup = d => desktopControls[d.key] = 0;

  c.addEventListener("click", handleClick, false);
  function handleClick(e) {
    e.preventDefault();
    console.log(e.clientX + " " + e.clientY);
    checkButtonPress(e.clientX, e.clientY);
  }
}

window.onresize = function () {
  window.location.reload();
}

function checkButtonPress(x, y) {
  if (
    !playing &&
    x > c.width / 2 - 54 &&
    x < c.width / 2 + 54 &&
    y > c.height / 3 + 50 &&
    y < c.height / 3 + 98
  ) {
    window.location.reload();
  }

  if (playing && x > 20 && x < 90 && y > c.height - 90 && y < c.height - 20) {
    console.log("left button");
  }

  if (playing && x > 110 && x < 180 && y > c.height - 90 && y < c.height - 20) {
    console.log("right button");
  }

  if (
    playing &&
    x > c.width - 90 &&
    x < c.width - 20 &&
    y > c.height - 90 &&
    y < c.height - 20
  ) {
    console.log("fire button");
  }
}
