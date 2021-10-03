import MethodChain from './MethodChain';

import {
  move,
  hitHorizontal,
  hitVertical,
  pressRight,
  pressLeft,
  releaseRight,
  releaseLeft,
  paddleMove,
} from './moves';

const { alert: warn } = window;

const canvas = document.getElementById('canvas');
const context = new MethodChain(canvas.getContext('2d'));

const BALL_RADIUS = 20;
const PADDLE_WIDTH = 200;
const PADDLE_HEIGHT = 30;

function drawBall(x, y) {
  context
    .beginPath()
    .arc(x, y, BALL_RADIUS, 0, Math.PI * 2, false)
    .set('fillStyle', 'green')
    .fill()
    .closePath();
}

function drawPaddle(x) {
  context
    .beginPath()
    .rect(x, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT)
    .set('fillStyle', '#0095DD')
    .fill()
    .closePath();
}

const initialState = {
  x: 240,
  y: 160,
  velocity: {
    dx: 2, dy: 2,
  },
  paddleX: (canvas.width - PADDLE_WIDTH) / 2,
};

let state = initialState;
let intervalId;

function gameOver() {
  warn('Game Over');
  state = initialState;
  document.location.reload();
  clearInterval(intervalId);
}

function bindKeyboardEvents() {
  const handleKeyDown = ({ key }) => {
    state = ({
      Right: pressRight,
      ArrowRight: pressRight,
      Left: pressLeft,
      ArrowLeft: pressLeft,
    })[key](state);
  };
  const handleKeyUp = ({ key }) => {
    state = ({
      Right: releaseRight,
      ArrowRight: releaseRight,
      Left: releaseLeft,
      ArrowLeft: releaseLeft,
    })[key](state);
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function movePaddle() {
  state = paddleMove(state);
}

function moveBall() {
  const {
    x, y, velocity, paddleX,
  } = state;
  const { dx, dy } = velocity;

  state = move(state);

  if (x + dx + BALL_RADIUS > canvas.width || x + dx - BALL_RADIUS < 0) {
    state = hitVertical(state);
  }

  if (y + dy - BALL_RADIUS < 0) {
    state = hitHorizontal(state);
  }

  if (
    y + dy + BALL_RADIUS > canvas.height - PADDLE_HEIGHT
    && x + dx >= paddleX
    && x + dx <= paddleX + PADDLE_WIDTH
  ) {
    state = hitHorizontal(state);
  }

  if (y + dy + BALL_RADIUS > canvas.height) {
    gameOver();
  }
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const { x, y, paddleX } = state;

  moveBall();
  movePaddle();
  drawBall(x, y);
  drawPaddle(paddleX);
}

bindKeyboardEvents();
intervalId = setInterval(draw, 0.01);
