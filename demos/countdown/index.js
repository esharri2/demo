export class CountdownTimer extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "countdown-timer", CountdownTimer);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    if (!window.Temporal) {
      import("https://cdn.jsdelivr.net/npm/temporal-polyfill@1.0.6/global.min.js").then(
        () => {
          this.init();
        },
      );
    } else {
      this.init();
    }

  
  }

  init() {
    const endTimestamp = this.dataset.endTime;

    if (!endTimestamp) {
      console.log("Missing data-end-time attribute");
      return;
    }

    this.endTime = Temporal.Instant.from(endTimestamp);
    this.currentTime = this.getNow();
    this.duration = this.getDuration();

    // TOD) add some early returns, document attr string format

    this.render();

    this.timer = setInterval(() => {
      this.currentTime = this.getNow();
      this.duration = this.getDuration();
      this.render();
    }, 1000);
  }

  disconnectedCallback() {
    this.timer.clearInterval();
  }

  getNow() {
    return Temporal.Now.instant();
  }

  getDuration() {
    return this.currentTime.until(this.endTime, {
      largestUnit: "hour",
      smallestUnit: "second",
      roundingMode: "floor",
    });
  }

  render() {
    const totalHours = Math.max(0, this.duration?.hours ?? 0);
    const minutes = Math.max(0, this.duration?.minutes ?? 0);
    const seconds = Math.max(0, this.duration?.seconds ?? 0);
    const days = Math.floor(totalHours >= 24 ? totalHours / 24 : 0);
    const hours = days > 0 ? totalHours % 24 : totalHours;
    this.innerHTML = `
      ${days > 0 ? `${days} <span>days</span>` : ""}
      ${hours > 0 ? `${hours} <span>hours</span>` : ""}
      ${minutes > 0 ? `${minutes} <span>minutes</span>` : ""}
      ${seconds > 0 ? `${seconds} <span>seconds</span>` : ""}
    `;
  }
}

CountdownTimer.register();
