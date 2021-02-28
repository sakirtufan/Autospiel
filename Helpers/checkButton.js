const checkButtonRelase = (playing, x, y, width, height, controlsArray) => {
  if (
    !playing &&
    x > width / 2 - 54 &&
    x < width / 2 + 54 &&
    y > height / 3 + 50 &&
    y < height / 3 + 98
  ) {
    window.location.reload();
  }

  if (playing && x > 20 && x < 90 && y > height - 90 && y < height - 20) {
    controlsArray.ArrowLeft = 0;
  }

  if (playing && x > 110 && x < 180 && y > height - 90 && y < height - 20) {
    controlsArray.ArrowRight = 0;
  }

  if (
    playing &&
    x > width - 90 &&
    x < width - 20 &&
    y > height - 90 &&
    y < height - 20
  ) {
    controlsArray.ArrowUp = 0;
  }
};

const checkButtonPress = (playing, x, y, width, height, controlsArray) => {
  if (
    !playing &&
    x > width / 2 - 54 &&
    x < width / 2 + 54 &&
    y > height / 3 + 50 &&
    y < height / 3 + 98
  ) {
    window.location.reload();
  }

  if (playing && x > 20 && x < 90 && y > height - 90 && y < height - 20) {
    controlsArray.ArrowLeft = 1;
  }

  if (playing && x > 110 && x < 180 && y > height - 90 && y < height - 20) {
    controlsArray.ArrowRight = 1;
  }

  if (
    playing &&
    x > width - 90 &&
    x < width - 20 &&
    y > height - 90 &&
    y < height - 20
  ) {
    controlsArray.ArrowUp = 1;
  }
};


export {
  checkButtonRelase,
  checkButtonPress
}