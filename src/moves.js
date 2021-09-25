function reducer(state, action) {
  const { x, y, velocity } = state;
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
  })[action]();
}

export const move = (state) => reducer(state, 'move');
export const hitHorizontal = (state) => reducer(state, 'hitHorizontal');
export const hitVertical = (state) => reducer(state, 'hitVertical');
