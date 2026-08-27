export function createCanvasContext(canvas, width, height) {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);
  return context;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function rectsOverlap(first, second) {
  return first.x < second.x + second.width && first.x + first.width > second.x && first.y < second.y + second.height && first.y + first.height > second.y;
}
