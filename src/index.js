class MethodChain {
  constructor(obj) {
    if (!(this instanceof MethodChain)) {
      return new MethodChain(...obj);
    }

    this.obj = obj;

    // eslint-disable-next-line no-restricted-syntax
    for (const method in obj) {
      if (typeof obj[method] === 'function') {
        this[method] = (...args) => {
          this.obj[method](...args);
          return this;
        };
      }
    }
  }

  set(prop, val) {
    this.obj[prop] = val;
    return this;
  }
}

const canvas = document.getElementById('canvas');
const context = new MethodChain(canvas.getContext('2d'));

function drawBall(x, y) {
  context
    .beginPath()
    .arc(x, y, 20, 0, Math.PI * 2, false)
    .set('fillStyle', 'green')
    .fill()
    .closePath();
}

const state = {
  x: 240,
  y: 160,
};

function moveBall() {
  state.x += 1;
  state.y += 1;
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const { x, y } = state;

  drawBall(x, y);
  moveBall();
}

setInterval(draw, 10);
