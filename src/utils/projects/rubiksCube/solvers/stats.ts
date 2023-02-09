export class StatsTracker {
  private total = 0;

  private discarded = 0;

  private startTime = performance.now();

  incrementDiscarded() {
    this.discarded++;
  }

  incrementTotal() {
    this.total++;
  }

  get stats() {
    const now = performance.now();

    const elapsedTime = now - this.startTime;

    const positionsPerSecond = this.total / (elapsedTime / 1000);

    return {
      total: this.total,
      discarded: this.discarded,
      elapsedTime,
      positionsPerSecond,
    };
  }
}
