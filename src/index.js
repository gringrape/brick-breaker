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
  brickBreak,
} from './moves';

const { alert: warn } = window;

const canvas = document.getElementById('canvas');
const context = new MethodChain(canvas.getContext('2d'));

const BALL_RADIUS = 20;

const PADDLE_WIDTH = 200;
const PADDLE_HEIGHT = 30;

const ROW_COUNT = 3;
const COLUMN_COUNT = 5;

const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 30;
const BRICK_PADDING = 10;

const OFFSET_LEFT = 20;
const OFFSET_TOP = 10;

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

function range(from, to) {
  return [...Array(to - from)].map((_, i) => i);
}

function drawBricks({ bricks }) {
  const drawBrick = ({ x, y }) => {
    context
      .beginPath()
      .rect(x, y, BRICK_WIDTH, BRICK_HEIGHT)
      .set('fillStyle', '#0095DD')
      .fill()
      .closePath();
  };

  bricks.forEach((row, r) => {
    row.forEach(({ isBroken }, c) => {
      if (!isBroken) {
        drawBrick({
          x: OFFSET_LEFT + (c + 1) * (BRICK_WIDTH + BRICK_PADDING),
          y: OFFSET_TOP + (r + 1) * (BRICK_HEIGHT + BRICK_PADDING),
        });
      }
    });
  });
}

const initialState = {
  x: 240,
  y: 160,
  velocity: {
    dx: 2, dy: 2,
  },
  paddleX: (canvas.width - PADDLE_WIDTH) / 2,
  bricks: range(0, ROW_COUNT).map(() => (
    range(0, COLUMN_COUNT).map(() => ({
      isBroken: false,
    }))
  )),
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

function detectCollision({ x, y, bricks }) {
  const collide = ({ positionX, positionY }) => (
    x > positionX && x < positionX + BRICK_WIDTH && y > positionY && y < positionY + BRICK_HEIGHT
  );

  bricks.forEach((row, r) => {
    row.forEach((item, c) => {
      const { isBroken } = item;

      const positionX = OFFSET_LEFT + (c + 1) * (BRICK_WIDTH + BRICK_PADDING);
      const positionY = OFFSET_TOP + (r + 1) * (BRICK_HEIGHT + BRICK_PADDING);

      if (!isBroken && collide({ positionX, positionY })) {
        state = brickBreak(state, { r, c });
        state = hitHorizontal(state);
      }
    });
  });
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const {
    x, y, paddleX, bricks,
  } = state;

  moveBall();
  movePaddle();

  drawBall(x, y);
  drawPaddle(paddleX);
  drawBricks({ bricks });

  detectCollision({ x, y, bricks });
}

bindKeyboardEvents();
intervalId = setInterval(draw, 0.01);
