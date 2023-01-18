import debounce from "lodash.debounce";
import ResizeObserver from "resize-observer-polyfill";

let resizeObserver: ResizeObserver | undefined;

type ResizeCallback = (width: number, height: number) => void;

export function setup(host: HTMLElement, callback: ResizeCallback) {
  function resize() {
    callback(host.clientWidth, host.clientHeight);
  }

  resizeObserver = new ResizeObserver(debounce(resize, 100));

  resizeObserver.observe(host);

  resize();
}

export function destroy() {
  resizeObserver?.disconnect();

  resizeObserver = undefined;
}
