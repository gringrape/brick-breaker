import { move, hitHorizontal } from './moves.js';

test('move', () => {
  const state = {
    x: 1, y: 1, velocity: { dx: 1, dy: 1 },
  };

  expect(move(state)).toEqual({
    x: 2, y: 2, velocity: { dx: 1, dy: 1 },
  });
});

test('hit the bottom wall', () => {
  const state = {
    x: 1, y: 1, velocity: { dx: 1, dy: 1 },
  };

  const { velocity } = hitHorizontal(state);

  expect(velocity).toEqual({
    dx: 1, dy: -1,
  });
});
