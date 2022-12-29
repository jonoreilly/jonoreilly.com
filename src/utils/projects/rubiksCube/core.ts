import * as Canvas from "./canvas";
import * as Resizer from "./resizer";

export type State = {
  cube?: ReturnType<typeof Canvas.getCube>;
};

export const state: State = {};

type Runtime = {
  isRunning: boolean;
  nextAnimationFrame?: number;
};

const runtime: Runtime = {
  isRunning: false,
};

export function setup(host: HTMLElement, callback?: () => void) {
  // Setup

  const canvas = Canvas.setup();

  Resizer.setup(host, Canvas.setSize);

  host.appendChild(canvas);

  animate(callback);

  // Initialise

  state.cube = Canvas.getCube();

  Canvas.add(state.cube);
}

export function destroy() {
  runtime.isRunning = false;

  state.cube = undefined;

  Resizer.destroy();

  Canvas.destroy();
}

function animate(callback?: () => void) {
  // Only allow one runtime animation cycle
  if (runtime.isRunning && runtime.nextAnimationFrame) {
    cancelAnimationFrame(runtime.nextAnimationFrame);
  }

  runtime.isRunning = true;

  function _() {
    if (runtime.isRunning) {
      requestAnimationFrame(() => _());

      callback?.();

      Canvas.render();
    }
  }

  _();
}
