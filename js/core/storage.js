const namespace = "ignacioArcade:";

function read(key, fallback) {
  try {
    const value = localStorage.getItem(`${namespace}${key}`);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(`${namespace}${key}`, JSON.stringify(value));
  } catch {
    return false;
  }
  return true;
}

export const storage = {
  get(key, fallback = null) {
    return read(key, fallback);
  },
  set(key, value) {
    return write(key, value);
  },
  getBestScore(gameId) {
    return Number(read(`${gameId}BestScore`, 0)) || 0;
  },
  saveBestScore(gameId, score) {
    const best = this.getBestScore(gameId);
    if (score > best) {
      write(`${gameId}BestScore`, score);
      return true;
    }
    return false;
  },
  getSoundEnabled() {
    return read("soundEnabled", true) !== false;
  },
  setSoundEnabled(enabled) {
    return write("soundEnabled", Boolean(enabled));
  }
};
