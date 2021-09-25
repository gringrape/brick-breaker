function reducer(state, action) {
  const {
    x, y, velocity, paddleX, leftPressed, rightPressed,
  } = state;
  const { dx, dy } = velocity;

  return ({
    move() {
      return ({
        ...state,
        x: x + dx,
        y: y + dy,
      });
    },
    hitHorizontal() {
      return ({
        ...state,
        velocity: {
          ...velocity,
          dy: -dy,
        },
      });
    },
    hitVertical() {
      return ({
        ...state,
        velocity: {
          ...velocity,
          dx: -dx,
        },
      });
    },
    pressRight() {
      return ({
        ...state,
        rightPressed: true,
      });
    },
    pressLeft() {
      return ({
        ...state,
        leftPressed: true,
      });
    },
    releaseRight() {
      return ({
        ...state,
        rightPressed: false,
      });
    },
    releaseLeft() {
      return ({
        ...state,
        leftPressed: false,
      });
    },
    paddleMove() {
      let direction = 0;

      if (leftPressed) {
        direction = -1;
      }

      if (rightPressed) {
        direction = 1;
      }

      return ({
        ...state,
        paddleX: paddleX + direction * 3,
      });
    },
  })[action]();
}

export const move = (state) => reducer(state, 'move');
export const hitHorizontal = (state) => reducer(state, 'hitHorizontal');
export const hitVertical = (state) => reducer(state, 'hitVertical');
export const pressRight = (state) => reducer(state, 'pressRight');
export const pressLeft = (state) => reducer(state, 'pressLeft');
export const releaseRight = (state) => reducer(state, 'releaseRight');
export const releaseLeft = (state) => reducer(state, 'releaseLeft');
export const paddleMove = (state) => reducer(state, 'paddleMove');
