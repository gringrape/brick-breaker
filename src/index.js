import MethodChain from './MethodChain';

import {
  move,
  hitHorizontal,
  hitVertical,
} from './moves';

const canvas = document.getElementById('canvas');
const context = new MethodChain(canvas.getContext('2d'));

const BALL_RADIUS = 20;

function drawBall(x, y) {
  context
    .beginPath()
    .arc(x, y, BALL_RADIUS, 0, Math.PI * 2, false)
    .set('fillStyle', 'green')
    .fill()
    .closePath();
}

let state = {
  x: 240,
  y: 160,
  velocity: {
    dx: 2, dy: 2,
  },
};

function moveBall() {
  const { x, y, velocity } = state;
  const { dx, dy } = velocity;

  state = move(state);

  if (x + dx + BALL_RADIUS > canvas.width || x + dx - BALL_RADIUS < 0) {
    state = hitVertical(state);
  }

  if (y + dy + BALL_RADIUS > canvas.height || y + dy - BALL_RADIUS < 0) {
    state = hitHorizontal(state);
  }
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const { x, y } = state;

  moveBall();
  drawBall(x, y);
}

setInterval(draw, 0.5);
