// Wrap autoplay video element with one or more source elements that have the `src` attribute replaced with `data-src`
export class VideoControls extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "video-controls", VideoControls);
  }

  connectedCallback() {
    const videoId = this.getAttribute("data-id");

    if (!videoId) {
      return;
    }

    this.video = document.getElementById(videoId);

    if (!this.video) {
      return;
    }

    // Used to detach event listeners
    this.abortController = new AbortController();

    this.playButton = this.querySelector("[data-play]");
    this.muteButton = this.querySelector("[data-mute]");
    this.progressBar = this.querySelector("[data-progress]");

    this.video.addEventListener("loadedmetadata", (event) => {
      this.bindEvents();
    });
  }

  bindEvents() {
    if (this.muteButton) {
      this.muteButton.setAttribute("aria-pressed", this.video.muted);
      this.muteButton.addEventListener(
        "click",
        this.handleMuteButtonClick.bind(this),

        { signal: this.abortController.signal },
      );
    }

    if (this.playButton) {
      this.playButton.setAttribute("aria-pressed", !this.video.paused);
      this.playButton.addEventListener(
        "click",
        this.handlePlayButtonClick.bind(this),

        { signal: this.abortController.signal },
      );
    }

    if (this.progressBar) {
      this.transitionDuration = getComputedStyle(this)
        .getPropertyValue("--transition-duration")
        .replace("s", "")
        .replace("ms", "");
      this.progressAdjustment = Number(
        this.transitionDuration / this.video.duration,
      ) * 100;

      this.video.addEventListener(
        "timeupdate",
        this.handleTimeUpdate.bind(this),
        { signal: this.abortController.signal },
      );

      this.progressBar.addEventListener(
        "input",
        this.handleProgressBarDrag.bind(this),
        { signal: this.abortController.signal },
      );

      this.progressBar.addEventListener(
        "pointerdown",
        this.handleProgressBarDragStart.bind(this),
        { signal: this.abortController.signal },
      );
    }
  }

  // Mute / unmute
  handleMuteButtonClick() {
    this.video.muted = !this.video.muted;
    this.muteButton.setAttribute("aria-pressed", this.video.muted);
  }

  // Play / pause
  handlePlayButtonClick() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
    this.playButton.setAttribute("aria-pressed", !this.video.paused);
  }

  handleTimeUpdate() {
    const percent = (this.video.currentTime / this.video.duration) * 100;

    this.progressBar.value = percent;

    this.setProgressStyle(percent);
  }

  handleProgressBarDrag(event) {
    const value = event.target.value;
    const percentComplete = value * 0.01;
    this.video.currentTime = percentComplete * this.video.duration;

    this.setProgressStyle(value);
  }

  handleProgressBarDragStart(event) {
    // TODO stop animation?
    if (this.video.paused) {
      return;
    }

    this.video.pause();
    this.progressBar.addEventListener(
      "pointerup",
      this.handleProgressBarDragEnd.bind(this),
      {
        once: true,
        signal: this.abortController.signal,
      },
    );
  }

  handleProgressBarDragEnd(event) {
    // TODO stop animation
    console.log("DRAG END!");
    this.video.play();
  }

  setProgressStyle(percent) {
    // Progress is padded since the transition duration makes the bar lag behind current time (transition duration is .5)
    const adjustment = percent === 0 ? 0 : this.progressAdjustment
    this.progressBar.style.setProperty(
      "--range-pct",
      `${percent + adjustment}%`,
    );
  }

  disconnectedCallback() {
    this.abortController.abort();
  }
}

VideoControls.register();

// https://stackoverflow.com/questions/6877403/how-to-tell-if-a-video-element-is-currently-playing
